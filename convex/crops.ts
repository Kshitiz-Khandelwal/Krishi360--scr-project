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

    const crops = [
      {
        name: "Onion",
        image: "🧅",
        soilRequirements: {
          type: ["loam", "sandy-loam"],
          phRange: { min: 6.0, max: 7.5 },
        },
        climateRequirements: {
          rainfall: { min: 600, max: 1000 },
          temperature: { min: 15, max: 25 },
        },
        marketPrice: 2500,
        diseaseRisk: 4,
        growthDays: 120,
        baseTemperature: 10,
        waterRequirement: 2.5,
      },
      {
        name: "Potato",
        image: "🥔",
        soilRequirements: {
          type: ["loam", "sandy-loam", "clay-loam"],
          phRange: { min: 5.5, max: 6.5 },
        },
        climateRequirements: {
          rainfall: { min: 500, max: 800 },
          temperature: { min: 15, max: 20 },
        },
        marketPrice: 1800,
        diseaseRisk: 6,
        growthDays: 90,
        baseTemperature: 7,
        waterRequirement: 3.0,
      },
      {
        name: "Maize",
        image: "🌽",
        soilRequirements: {
          type: ["loam", "clay-loam", "sandy-loam"],
          phRange: { min: 6.0, max: 7.0 },
        },
        climateRequirements: {
          rainfall: { min: 600, max: 1200 },
          temperature: { min: 20, max: 30 },
        },
        marketPrice: 2200,
        diseaseRisk: 3,
        growthDays: 110,
        baseTemperature: 10,
        waterRequirement: 4.0,
      },
      {
        name: "Rice",
        image: "🌾",
        soilRequirements: {
          type: ["clay", "clay-loam"],
          phRange: { min: 5.5, max: 7.0 },
        },
        climateRequirements: {
          rainfall: { min: 1000, max: 2000 },
          temperature: { min: 20, max: 35 },
        },
        marketPrice: 2000,
        diseaseRisk: 5,
        growthDays: 120,
        baseTemperature: 12,
        waterRequirement: 5.0,
      },
    ];

    for (const crop of crops) {
      await ctx.db.insert("crops", crop);
    }
  },
});
