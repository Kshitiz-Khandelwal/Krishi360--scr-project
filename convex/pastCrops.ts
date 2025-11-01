import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPastCrops = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const farmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!farmer) return [];

    return await ctx.db
      .query("pastCrops")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmer._id))
      .order("desc")
      .collect();
  },
});

export const addPastCrop = mutation({
  args: {
    cropName: v.string(),
    plantedDate: v.number(),
    harvestedDate: v.number(),
    quantity: v.number(),
    pricePerKg: v.number(),
    totalRevenue: v.number(),
    buyer: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const farmer = await ctx.db
      .query("farmers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!farmer) throw new Error("Farmer profile not found");

    return await ctx.db.insert("pastCrops", {
      farmerId: farmer._id,
      cropName: args.cropName,
      plantedDate: args.plantedDate,
      harvestedDate: args.harvestedDate,
      quantity: args.quantity,
      pricePerKg: args.pricePerKg,
      totalRevenue: args.totalRevenue,
      buyer: args.buyer,
      notes: args.notes,
    });
  },
});
