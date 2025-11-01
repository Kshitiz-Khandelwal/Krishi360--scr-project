import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateRecommendations = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const farmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!farmer) throw new Error("Farmer profile not found");

    const crops = await ctx.db.query("crops").collect();
    const recommendations = [];

    for (const crop of crops) {
      const csi = calculateCSI(farmer, crop);
      const reasons = getReasons(farmer, crop, csi);
      
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

function calculateCSI(farmer: any, crop: any): number {
  // Weights for different factors
  const weights = {
    soil: 0.3,
    climate: 0.25,
    market: 0.2,
    disease: 0.15,
    water: 0.1,
  };

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
    weights.soil * soilScore +
    weights.climate * climateScore +
    weights.market * marketScore +
    weights.disease * diseaseScore +
    weights.water * waterScore
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

function getReasons(farmer: any, crop: any, csi: number): string[] {
  const reasons = [];
  
  if (csi > 80) {
    reasons.push("Excellent match for your soil and climate");
    reasons.push("High market demand and good prices");
  } else if (csi > 60) {
    reasons.push("Good compatibility with your farm conditions");
    if (crop.diseaseRisk < 4) reasons.push("Low disease risk");
  } else {
    reasons.push("Moderate suitability - consider with care");
    if (crop.waterRequirement > 4) reasons.push("High water requirement");
  }
  
  return reasons;
}
