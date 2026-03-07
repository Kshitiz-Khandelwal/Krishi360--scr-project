import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllCrops = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("crops").collect();
  },
});

export const seedCrops = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCrops = await ctx.db.query("crops").collect();
    if (existingCrops.length > 0) return;

    await insertCrops(ctx);
  },
});

export const forceSeedCrops = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete existing crops
    const existingCrops = await ctx.db.query("crops").collect();
    for (const crop of existingCrops) {
      await ctx.db.delete(crop._id);
    }

    // Insert new crops
    await insertCrops(ctx);
  },
});

async function insertCrops(ctx: any) {
  const crops = [
    // --- Cereals & Grains ---
    {
      name: "Wheat",
      image: "🌾",
      soilRequirements: { type: ["loam", "clay-loam", "silt-loam"], phRange: { min: 6.0, max: 7.5 } },
      climateRequirements: { rainfall: { min: 450, max: 650 }, temperature: { min: 10, max: 25 } },
      marketPrice: 2200, diseaseRisk: 4, growthDays: 120, baseTemperature: 4, waterRequirement: 3.5,
    },
    {
      name: "Pearl Millet",
      image: "🌾",
      soilRequirements: { type: ["sandy", "sandy-loam"], phRange: { min: 5.5, max: 8.0 } },
      climateRequirements: { rainfall: { min: 300, max: 500 }, temperature: { min: 25, max: 35 } },
      marketPrice: 2000, diseaseRisk: 2, growthDays: 85, baseTemperature: 10, waterRequirement: 1.5,
    },
    {
      name: "Sorghum",
      image: "🌾",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 5.5, max: 8.5 } },
      climateRequirements: { rainfall: { min: 400, max: 600 }, temperature: { min: 20, max: 35 } },
      marketPrice: 2300, diseaseRisk: 3, growthDays: 110, baseTemperature: 8, waterRequirement: 2.0,
    },
    {
      name: "Maize",
      image: "🌽",
      soilRequirements: { type: ["loam", "clay-loam", "sandy-loam"], phRange: { min: 6.0, max: 7.0 } },
      climateRequirements: { rainfall: { min: 600, max: 1200 }, temperature: { min: 20, max: 30 } },
      marketPrice: 2200, diseaseRisk: 3, growthDays: 110, baseTemperature: 10, waterRequirement: 4.0,
    },
    {
      name: "Rice",
      image: "🌾",
      soilRequirements: { type: ["clay", "clay-loam"], phRange: { min: 5.5, max: 7.0 } },
      climateRequirements: { rainfall: { min: 1000, max: 2000 }, temperature: { min: 20, max: 35 } },
      marketPrice: 2000, diseaseRisk: 5, growthDays: 120, baseTemperature: 12, waterRequirement: 5.0,
    },

    // --- Pulses & Legumes ---
    {
      name: "Chickpea",
      image: "🥜",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 6.0, max: 8.0 } },
      climateRequirements: { rainfall: { min: 400, max: 600 }, temperature: { min: 15, max: 30 } },
      marketPrice: 5500, diseaseRisk: 5, growthDays: 110, baseTemperature: 5, waterRequirement: 2.0,
    },
    {
      name: "Pigeon Pea",
      image: "🌱",
      soilRequirements: { type: ["loam", "sandy-loam"], phRange: { min: 5.5, max: 7.5 } },
      climateRequirements: { rainfall: { min: 600, max: 1000 }, temperature: { min: 20, max: 35 } },
      marketPrice: 6500, diseaseRisk: 4, growthDays: 150, baseTemperature: 10, waterRequirement: 3.0,
    },
    {
      name: "Soybean",
      image: "🌱",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 6.0, max: 7.5 } },
      climateRequirements: { rainfall: { min: 600, max: 1000 }, temperature: { min: 20, max: 35 } },
      marketPrice: 4200, diseaseRisk: 6, growthDays: 100, baseTemperature: 10, waterRequirement: 3.5,
    },

    // --- Cash Crops & Commercial ---
    {
      name: "Cotton",
      image: "☁️",
      soilRequirements: { type: ["clay", "clay-loam", "black"], phRange: { min: 5.5, max: 8.0 } },
      climateRequirements: { rainfall: { min: 500, max: 800 }, temperature: { min: 20, max: 35 } },
      marketPrice: 7000, diseaseRisk: 8, growthDays: 160, baseTemperature: 12, waterRequirement: 4.5,
    },
    {
      name: "Sugarcane",
      image: "🎋",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 6.5, max: 7.5 } },
      climateRequirements: { rainfall: { min: 1000, max: 2500 }, temperature: { min: 20, max: 35 } },
      marketPrice: 350, diseaseRisk: 4, growthDays: 300, baseTemperature: 12, waterRequirement: 6.0,
    },
    {
      name: "Groundnut",
      image: "🥜",
      soilRequirements: { type: ["sandy", "sandy-loam", "loam"], phRange: { min: 6.0, max: 7.0 } },
      climateRequirements: { rainfall: { min: 500, max: 1000 }, temperature: { min: 20, max: 30 } },
      marketPrice: 5800, diseaseRisk: 5, growthDays: 105, baseTemperature: 10, waterRequirement: 3.0,
    },
    {
      name: "Mustard",
      image: "🌼",
      soilRequirements: { type: ["sandy-loam", "loam"], phRange: { min: 6.0, max: 7.5 } },
      climateRequirements: { rainfall: { min: 400, max: 600 }, temperature: { min: 10, max: 25 } },
      marketPrice: 5000, diseaseRisk: 3, growthDays: 110, baseTemperature: 5, waterRequirement: 2.5,
    },

    // --- Vegetables & Spices ---
    {
      name: "Onion",
      image: "🧅",
      soilRequirements: { type: ["loam", "sandy-loam"], phRange: { min: 6.0, max: 7.5 } },
      climateRequirements: { rainfall: { min: 600, max: 1000 }, temperature: { min: 15, max: 25 } },
      marketPrice: 2500, diseaseRisk: 4, growthDays: 120, baseTemperature: 10, waterRequirement: 2.5,
    },
    {
      name: "Potato",
      image: "🥔",
      soilRequirements: { type: ["loam", "sandy-loam", "clay-loam"], phRange: { min: 5.5, max: 6.5 } },
      climateRequirements: { rainfall: { min: 500, max: 800 }, temperature: { min: 15, max: 20 } },
      marketPrice: 1800, diseaseRisk: 6, growthDays: 90, baseTemperature: 7, waterRequirement: 3.0,
    },
    {
      name: "Tomato",
      image: "🍅",
      soilRequirements: { type: ["loam", "sandy-loam"], phRange: { min: 6.0, max: 7.0 } },
      climateRequirements: { rainfall: { min: 600, max: 1200 }, temperature: { min: 20, max: 30 } },
      marketPrice: 2000, diseaseRisk: 7, growthDays: 100, baseTemperature: 10, waterRequirement: 3.5,
    },
    {
      name: "Chilli",
      image: "🌶️",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 5.5, max: 7.0 } },
      climateRequirements: { rainfall: { min: 600, max: 1200 }, temperature: { min: 20, max: 30 } },
      marketPrice: 8000, diseaseRisk: 7, growthDays: 150, baseTemperature: 12, waterRequirement: 3.0,
    },
    {
      name: "Garlic",
      image: "🧄",
      soilRequirements: { type: ["loam", "sandy-loam"], phRange: { min: 6.0, max: 7.0 } },
      climateRequirements: { rainfall: { min: 500, max: 700 }, temperature: { min: 12, max: 25 } },
      marketPrice: 6000, diseaseRisk: 3, growthDays: 150, baseTemperature: 5, waterRequirement: 2.0,
    },
    {
      name: "Turmeric",
      image: "🌟",
      soilRequirements: { type: ["loam", "clay-loam"], phRange: { min: 5.5, max: 7.5 } },
      climateRequirements: { rainfall: { min: 1000, max: 2000 }, temperature: { min: 20, max: 35 } },
      marketPrice: 7000, diseaseRisk: 4, growthDays: 250, baseTemperature: 15, waterRequirement: 4.0,
    },
    {
      name: "Ginger",
      image: "🫚",
      soilRequirements: { type: ["loam", "sandy-loam"], phRange: { min: 6.0, max: 7.0 } },
      climateRequirements: { rainfall: { min: 1500, max: 2500 }, temperature: { min: 20, max: 30 } },
      marketPrice: 8500, diseaseRisk: 5, growthDays: 240, baseTemperature: 15, waterRequirement: 4.5,
    },
  ];

  for (const crop of crops) {
    await ctx.db.insert("crops", crop);
  }
}
