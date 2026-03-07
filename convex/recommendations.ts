import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Strategy Definitions
const STRATEGIES = {
  "Balanced": {
    soil: 0.30, climate: 0.25, market: 0.20, disease: 0.15, water: 0.10,
    description: "Balanced approach for moderate profit and risk"
  },
  "High-Profit": {
    market: 0.45, climate: 0.20, soil: 0.15, disease: 0.10, water: 0.10,
    description: "Prioritizes high market value, accepts higher risk"
  },
  "Low-Risk": {
    disease: 0.30, climate: 0.25, soil: 0.25, water: 0.10, market: 0.10,
    description: "Prioritizes stability and disease resistance"
  },
  "Water-Saving": {
    water: 0.40, climate: 0.25, soil: 0.20, disease: 0.10, market: 0.05,
    description: "Optimized for water scarcity and efficiency"
  },
  "Sustainable": {
    soil: 0.30, water: 0.25, climate: 0.20, disease: 0.15, market: 0.10,
    description: "Focuses on soil health and long-term sustainability"
  },
  "Market-Driven": {
    market: 0.50, climate: 0.20, soil: 0.15, disease: 0.10, water: 0.05,
    description: "Optimized for current market trends and demand"
  }
};

export type StrategyType = keyof typeof STRATEGIES;

export const generateRecommendations = mutation({
  args: {
    strategy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const farmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!farmer) throw new Error("Farmer profile not found");

    const strategyName = (args.strategy || "Balanced") as StrategyType;
    const strategyWeights = STRATEGIES[strategyName] || STRATEGIES["Balanced"];

    const crops = await ctx.db.query("crops").collect();
    const recommendations = [];

    for (const crop of crops) {
      const csi = calculateCSI(farmer, crop, strategyWeights);
      const reasons = getReasons(farmer, crop, csi, strategyName);

      recommendations.push({
        cropId: crop._id,
        csi,
        reasons,
      });
    }

    // Sort by CSI and take top 5
    recommendations.sort((a, b) => b.csi - a.csi);
    const topRecommendations = recommendations.slice(0, 5);

    // Save recommendations
    await ctx.db.insert("recommendations", {
      farmerId: farmer._id,
      crops: topRecommendations,
      createdAt: Date.now(),
      strategy: strategyName,
    });

    return topRecommendations;
  },
});

export const getLatestRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const farmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!farmer) return null;

    const recommendation = await ctx.db
      .query("recommendations")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmer._id))
      .order("desc")
      .first();

    if (!recommendation) return null;

    const cropsWithDetails = await Promise.all(
      recommendation.crops.map(async (rec) => {
        const crop = await ctx.db.get(rec.cropId);
        return { ...rec, crop };
      })
    );

    return { ...recommendation, crops: cropsWithDetails };
  },
});

function calculateCSI(farmer: any, crop: any, weights: any): number {
  // Soil suitability (0-1)
  const soilScore = calculateSoilScore(farmer, crop);

  // Climate suitability (0-1)
  const climateScore = calculateClimateScore(farmer, crop);

  // Market price factor (normalized)
  const marketScore = Math.min(crop.marketPrice / 3000, 1);

  // Disease resistance (inverted, lower risk = higher score)
  const diseaseScore = (10 - crop.diseaseRisk) / 10;

  // Water efficiency (lower requirement = higher score for water-scarce areas)
  const waterScore = farmer.rainfall < 800 ? (6 - crop.waterRequirement) / 6 : 0.8;

  const csi = (
    (weights.soil || 0) * soilScore +
    (weights.climate || 0) * climateScore +
    (weights.market || 0) * marketScore +
    (weights.disease || 0) * diseaseScore +
    (weights.water || 0) * waterScore
  ) * 100;

  return Math.round(csi * 100) / 100;
}

function calculateSoilScore(farmer: any, crop: any): number {
  const soilTypeMatch = crop.soilRequirements.type.includes(farmer.soilType) ? 1 : 0.3;
  const phInRange = farmer.soilPh >= crop.soilRequirements.phRange.min &&
    farmer.soilPh <= crop.soilRequirements.phRange.max ? 1 : 0.5;
  return (soilTypeMatch + phInRange) / 2;
}

function calculateClimateScore(farmer: any, crop: any): number {
  const rainfallInRange = farmer.rainfall >= crop.climateRequirements.rainfall.min &&
    farmer.rainfall <= crop.climateRequirements.rainfall.max ? 1 : 0.4;

  const avgTemp = (farmer.temperature.min + farmer.temperature.max) / 2;
  const tempInRange = avgTemp >= crop.climateRequirements.temperature.min &&
    avgTemp <= crop.climateRequirements.temperature.max ? 1 : 0.4;

  return (rainfallInRange + tempInRange) / 2;
}

function getReasons(farmer: any, crop: any, csi: number, strategy: string = "Balanced"): string[] {
  const reasons = [];

  // Strategy-specific reasons
  if (strategy === "High-Profit" || strategy === "Market-Driven") {
    if (crop.marketPrice > 5000) reasons.push("Top performer for profit potential");
    else if (crop.marketPrice > 3000) reasons.push("Good market value");
  }

  if (strategy === "Low-Risk") {
    if (crop.diseaseRisk < 3) reasons.push("Excellent disease resistance");
    reasons.push("Stable crop choice for your region");
  }

  if (strategy === "Water-Saving") {
    if (crop.waterRequirement < 3) reasons.push("Highly water-efficient crop");
    else if (crop.waterRequirement < 5) reasons.push("Moderate water needs suitable for dry spells");
  }

  if (strategy === "Sustainable") {
    reasons.push("Aligns with long-term soil health");
  }

  // General fallback reasons logic if we need more padding or for Balanced
  if (reasons.length < 2) {
    if (csi > 80) {
      reasons.push("Excellent match for your soil and climate");
    } else if (csi > 60) {
      reasons.push("Good compatibility with your farm conditions");
    }
  }

  // Always highlight specific strengths if they are outstanding
  if (crop.diseaseRisk <= 2 && !reasons.some(r => r.includes("disease")))
    reasons.push("Very low disease risk");

  if (crop.marketPrice >= 6000 && !reasons.some(r => r.includes("profit") || r.includes("value")))
    reasons.push("High market demand premium");

  return reasons.slice(0, 3); // Limit to top 3 reasons
}
