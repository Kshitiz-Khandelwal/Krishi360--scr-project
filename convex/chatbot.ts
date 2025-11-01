import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGrokBot = action({
  args: { question: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Get farmer context for personalized responses
      const farmer = await ctx.runQuery(api.farmers.getCurrentFarmer);
      
      let contextPrompt = `You are Krishi Assistant, an expert AI farming advisor for Indian farmers. Provide practical, actionable advice in simple language.

Context about the farmer:`;
      
      if (farmer) {
        contextPrompt += `
- Location: ${farmer.location}
- Farm size: ${farmer.farmSize} acres
- Soil type: ${farmer.soilType}
- Soil pH: ${farmer.soilPh}
- Annual rainfall: ${farmer.rainfall}mm
- Temperature range: ${farmer.temperature.min}°C to ${farmer.temperature.max}°C`;
      }

      contextPrompt += `

Guidelines for responses:
- Keep answers practical and specific to Indian farming conditions
- Include relevant government schemes, helplines, or resources when applicable
- Mention specific products, techniques, or timing when relevant
- Use simple language that farmers can understand
- Include cost estimates in Indian Rupees when discussing solutions
- Reference local resources like Krishi Vigyan Kendras (KVK), mandi prices, etc.
- For urgent issues, suggest immediate actions and when to contact experts

Question: ${args.question}

Provide a helpful, practical response in 2-3 paragraphs:`;

      const result = await model.generateContent(contextPrompt);
      const answer = result.response.text();

      // Save to chat history
      if (farmer) {
        await ctx.runMutation(api.chatbot.saveChatMessage, {
          farmerId: farmer._id,
          question: args.question,
          answer,
        });
      }

      return answer;
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // Fallback to basic responses if API fails
      const fallbackResponses = {
        "soil": "For soil testing: Test pH levels (ideal 6.0-7.5), check organic matter content, and test NPK levels. Visit your nearest Krishi Vigyan Kendra (KVK) or use home testing kits. Contact Kisan Call Center: 1800-180-1551",
        "irrigation": "Best irrigation practices: Water early morning (6-8 AM) or evening (4-6 PM), check soil moisture before watering, use drip irrigation to save 40-50% water, and avoid overwatering.",
        "disease": "For crop diseases: Identify the disease type first, use copper sulfate for fungal diseases, ensure proper plant spacing, and use drip irrigation. For severe cases, consult your local agriculture extension officer.",
        "fertilizer": "Fertilizer application: Base on soil test results, apply NPK in split doses, use organic fertilizers like compost, and follow the 4R principle: Right source, Right rate, Right time, Right place.",
        "pest": "Pest management: Use integrated pest management (IPM), install pheromone traps, encourage beneficial insects, use neem-based organic pesticides, and maintain field hygiene.",
        "market": "Market information: Check mandi prices on eNAM portal, AgMarkNet, or call Kisan Call Center 1800-180-1551. Consider value addition and direct marketing for better prices."
      };

      const question = args.question.toLowerCase();
      let answer = "I'm here to help with your farming questions! Please ask about soil health, crop selection, irrigation, pest control, fertilizers, or market information.";

      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (question.includes(key)) {
          answer = response;
          break;
        }
      }

      // Save fallback response to chat history
      const farmer = await ctx.runQuery(api.farmers.getCurrentFarmer);
      if (farmer) {
        await ctx.runMutation(api.chatbot.saveChatMessage, {
          farmerId: farmer._id,
          question: args.question,
          answer,
        });
      }

      return answer;
    }
  },
});

export const saveChatMessage = mutation({
  args: {
    farmerId: v.id("farmers"),
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatHistory", {
      farmerId: args.farmerId,
      question: args.question,
      answer: args.answer,
      timestamp: Date.now(),
    });
  },
});

export const getChatHistory = query({
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
      .query("chatHistory")
      .withIndex("by_farmer", (q) => q.eq("farmerId", farmer._id))
      .order("desc")
      .take(10);
  },
});
