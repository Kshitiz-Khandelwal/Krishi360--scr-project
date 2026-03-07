import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentFarmer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const createOrUpdateFarmer = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    farmSize: v.number(),
    soilType: v.string(),
    soilPh: v.number(),
    rainfall: v.number(),
    minTemp: v.number(),
    maxTemp: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingFarmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const farmerData = {
      userId,
      name: args.name,
      location: args.location,
      farmSize: args.farmSize,
      soilType: args.soilType,
      soilPh: args.soilPh,
      rainfall: args.rainfall,
      temperature: {
        min: args.minTemp,
        max: args.maxTemp,
      },
    };

    if (existingFarmer) {
      await ctx.db.patch(existingFarmer._id, farmerData);
      return existingFarmer._id;
    } else {
      return await ctx.db.insert("farmers", farmerData);
    }
  },
});
