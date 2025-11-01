import { action, query } from "./_generated/server";
import { v } from "convex/values";

export const getWeatherData = action({
  args: { location: v.string() },
  handler: async (ctx, args) => {
    // Enhanced example weather data with more realistic alerts
    const exampleWeather = {
      location: args.location,
      temperature: 28,
      humidity: 65,
      rainfall: 12,
      windSpeed: 8,
      forecast: [
        { day: "Today", temp: 28, condition: "Partly Cloudy", rain: 20 },
        { day: "Tomorrow", temp: 30, condition: "Sunny", rain: 0 },
        { day: "Day 3", temp: 26, condition: "Rainy", rain: 80 },
      ],
      alerts: [
        {
          type: "irrigation",
          message: "Good time for irrigation - low rainfall expected for next 2 days",
          severity: "medium"
        },
        {
          type: "pest",
          message: "High humidity (65%) may increase fungal disease risk. Monitor crops closely",
          severity: "high"
        },
        {
          type: "weather",
          message: "Heavy rain expected on Day 3. Ensure proper drainage in fields",
          severity: "medium"
        },
        {
          type: "fertilizer",
          message: "Fertilizer shortage reported in nearby areas. Stock up if needed",
          severity: "low"
        }
      ]
    };

    return exampleWeather;
  },
});

export const getIrrigationGuide = query({
  args: { cropName: v.string(), farmSize: v.number() },
  handler: async (ctx, args) => {
    // Enhanced irrigation calculations
    const et0 = 5; // mm/day (example evapotranspiration)
    const kc = getCropCoefficient(args.cropName);
    const rainfallContribution = 0.3; // 30% from rainfall
    
    const waterNeedPerDay = et0 * kc * args.farmSize * (1 - rainfallContribution);
    
    return {
      cropName: args.cropName,
      dailyWaterNeed: Math.round(waterNeedPerDay),
      methods: {
        drip: {
          efficiency: 90,
          waterSaved: "40-50%",
          cost: "₹50,000-80,000 per acre (initial)",
          suitability: "Best for water-scarce areas, high-value crops"
        },
        sprinkler: {
          efficiency: 75,
          waterSaved: "20-30%",
          cost: "₹25,000-40,000 per acre (initial)",
          suitability: "Good for medium-sized fields, cereals"
        },
        flood: {
          efficiency: 60,
          waterSaved: "0%",
          cost: "₹5,000-15,000 per acre (initial)",
          suitability: "Traditional method, needs abundant water"
        }
      },
      recommendation: waterNeedPerDay > 100 ? "drip" : args.cropName.toLowerCase() === "rice" ? "flood" : "sprinkler"
    };
  },
});

function getCropCoefficient(cropName: string): number {
  const coefficients: Record<string, number> = {
    "rice": 1.2,
    "wheat": 1.0,
    "maize": 1.1,
    "potato": 1.0,
    "onion": 0.9,
    "tomato": 1.1,
    "cotton": 1.2,
    "sugarcane": 1.3
  };
  
  return coefficients[cropName.toLowerCase()] || 1.0;
}
