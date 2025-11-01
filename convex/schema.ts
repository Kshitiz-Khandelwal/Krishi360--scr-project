import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  farmers: defineTable({
    userId: v.id("users"),
    name: v.string(),
    location: v.string(),
    farmSize: v.number(), // in acres
    soilType: v.string(), // clay, loam, sandy, etc.
    soilPh: v.number(),
    rainfall: v.number(), // mm per year
    temperature: v.object({
      min: v.number(),
      max: v.number(),
    }),
    crops: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]),

  crops: defineTable({
    name: v.string(),
    image: v.string(),
    soilRequirements: v.object({
      type: v.array(v.string()),
      phRange: v.object({ min: v.number(), max: v.number() }),
    }),
    climateRequirements: v.object({
      rainfall: v.object({ min: v.number(), max: v.number() }),
      temperature: v.object({ min: v.number(), max: v.number() }),
    }),
    marketPrice: v.number(), // per quintal
    diseaseRisk: v.number(), // 1-10 scale
    growthDays: v.number(),
    baseTemperature: v.number(), // for GDD calculation
    waterRequirement: v.number(), // liters per day per plant
  }).index("by_name", ["name"]),

  recommendations: defineTable({
    farmerId: v.id("farmers"),
    crops: v.array(v.object({
      cropId: v.id("crops"),
      csi: v.number(),
      reasons: v.array(v.string()),
    })),
    createdAt: v.number(),
  }).index("by_farmer", ["farmerId"]),

  farmProgress: defineTable({
    farmerId: v.id("farmers"),
    cropId: v.id("crops"),
    plantedDate: v.number(),
    currentGdd: v.number(),
    growthPercentage: v.number(),
    wateringSchedule: v.array(v.number()),
    notes: v.optional(v.string()),
  }).index("by_farmer", ["farmerId"]),

  weatherAlerts: defineTable({
    location: v.string(),
    alertType: v.string(), // rainfall, temperature, pest, disease
    message: v.string(),
    severity: v.string(), // low, medium, high
    validUntil: v.number(),
  }).index("by_location", ["location"]),

  chatHistory: defineTable({
    farmerId: v.id("farmers"),
    question: v.string(),
    answer: v.string(),
    timestamp: v.number(),
  }).index("by_farmer", ["farmerId"]),

  pastCrops: defineTable({
    farmerId: v.id("farmers"),
    cropName: v.string(), // Now includes emoji (e.g., "🧅 Onion")
    plantedDate: v.number(),
    harvestedDate: v.number(),
    quantity: v.number(), // kg
    pricePerKg: v.number(),
    totalRevenue: v.number(),
    buyer: v.optional(v.string()), // New field for buyer information
    notes: v.optional(v.string()),
  }).index("by_farmer", ["farmerId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
