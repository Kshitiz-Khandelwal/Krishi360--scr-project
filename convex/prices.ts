import { action, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Mock realistic price variations for 2026
// This ensures our fallback simulator generates believable data based on a baseline.
const CROP_BASELINES: Record<string, { base: number, volatility: number }> = {
  "Wheat": { base: 2200, volatility: 0.03 },
  "Pearl Millet": { base: 2000, volatility: 0.05 },
  "Sorghum": { base: 2300, volatility: 0.04 },
  "Maize": { base: 2200, volatility: 0.06 },
  "Rice": { base: 2000, volatility: 0.02 },
  "Chickpea": { base: 5500, volatility: 0.07 },
  "Pigeon Pea": { base: 6500, volatility: 0.05 },
  "Soybean": { base: 4200, volatility: 0.08 },
  "Cotton": { base: 7000, volatility: 0.09 },
  "Sugarcane": { base: 350, volatility: 0.01 }, // Very stable
  "Groundnut": { base: 5800, volatility: 0.06 },
  "Mustard": { base: 5000, volatility: 0.05 },
  "Onion": { base: 2500, volatility: 0.15 }, // High volatility
  "Potato": { base: 1800, volatility: 0.12 }, // High volatility
  "Tomato": { base: 2000, volatility: 0.18 }, // Very high volatility
  "Chilli": { base: 8000, volatility: 0.10 },
  "Garlic": { base: 6000, volatility: 0.08 },
  "Turmeric": { base: 7000, volatility: 0.04 },
  "Ginger": { base: 8500, volatility: 0.07 },
};

/**
 * Action to fetch live prices from an API, or fallback to a realistic simulator.
 * Intended to be run periodically via a Cron Job or manually by an admin.
 */
export const fetchLivePrices = action({
  args: {},
  handler: async (ctx) => {
    // 1. Check for API Key in environment variables
    const apiKey = process.env.DATA_GOV_IN_API_KEY;

    let updatedPrices: Array<{ name: string, price: number }> = [];

    if (apiKey) {
      // IDEA: In a real production scenario, make a fetch call to data.gov.in here
      console.log("API Key found. Fetching from external API...");
      // Fake implementation for the sake of the demo, if key was present:
      // const response = await fetch(`https://api.data.gov.in/resource/...?api-key=${apiKey}`);
      // const data = await response.json();
      // updatedPrices = ...parse data...
    } 
    
    // 2. Hybrid Fallback: Realistic Simulator if API fetching fails or no key
    if (updatedPrices.length === 0) {
      console.log("Using Hybrid Realistic Market Simulator for prices...");
      
      for (const [cropName, config] of Object.entries(CROP_BASELINES)) {
        // Generate a random swing between -volatility and +volatility
        const swing = (Math.random() * 2 - 1) * config.volatility;
        const simulatedPrice = Math.round(config.base * (1 + swing));
        
        updatedPrices.push({
          name: cropName,
          price: simulatedPrice,
        });
      }
    }

    // 3. Mutate the database with the new prices
    await ctx.runMutation(internal.prices.updateCropPrices, { prices: updatedPrices });
    
    return { success: true, message: "Prices updated successfully", count: updatedPrices.length };
  },
});

/**
 * Internal mutation to actually write the prices to the database.
 * Actions cannot write directly to the DB, they must call a mutation.
 */
export const updateCropPrices = internalMutation({
  args: {
    prices: v.array(v.object({ name: v.string(), price: v.number() })),
  },
  handler: async (ctx, args) => {
    const crops = await ctx.db.query("crops").collect();
    const now = Date.now();

    for (const incoming of args.prices) {
      const cropRecord = crops.find(c => c.name.toLowerCase() === incoming.name.toLowerCase());
      if (cropRecord) {
        await ctx.db.patch(cropRecord._id, {
          marketPrice: incoming.price,
          priceLastUpdated: now,
        });
      }
    }
  },
});

/**
 * Query to check when prices were last updated system-wide.
 * Just looks at the first crop as a proxy since they update together.
 */
export const getPriceRefreshStatus = query({
  args: {},
  handler: async (ctx) => {
    const crop = await ctx.db.query("crops").first();
    return {
      lastUpdated: crop?.priceLastUpdated || null,
    };
  },
});
