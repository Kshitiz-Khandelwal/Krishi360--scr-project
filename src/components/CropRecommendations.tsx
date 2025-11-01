import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function CropRecommendations() {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateRecommendations = useMutation(api.recommendations.generateRecommendations);
  const recommendations = useQuery(api.recommendations.getLatestRecommendations);
  const seedCrops = useMutation(api.crops.seedCrops);

  useEffect(() => {
    // Seed crops data on component mount
    seedCrops();
  }, [seedCrops]);

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    try {
      await generateRecommendations();
      toast.success("Recommendations generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recommendations");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🌿 Crop Recommendations</h2>
            <p className="text-gray-600">
              Get personalized crop suggestions based on your soil, climate, and market conditions
            </p>
          </div>
          <button
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? "Analyzing..." : "Get Recommendations"}
          </button>
        </div>
      </div>

      {/* CSI Formula Explanation */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">📊 How We Calculate Crop Suitability Index (CSI)</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Formula:</strong> CSI = Σ(wᵢ × Fᵢᵖ)</p>
          <p><strong>Weights:</strong> Soil compatibility (30%) + Climate match (25%) + Market price (20%) + Disease resistance (15%) + Water efficiency (10%)</p>
          <p><strong>Score Range:</strong> 0-100 (Higher is better)</p>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.crops.map((rec, index) => (
            <div
              key={rec.cropId}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                index === 0 
                  ? "border-green-300 bg-green-50" 
                  : index === 1 
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-gray-200"
              }`}
            >
              {/* Rank Badge */}
              {index < 3 && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  index === 0 
                    ? "bg-green-200 text-green-800" 
                    : index === 1 
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-orange-200 text-orange-800"
                }`}>
                  {index === 0 ? "🥇 Best Match" : index === 1 ? "🥈 Good Option" : "🥉 Consider"}
                </div>
              )}

              {/* Crop Info */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{rec.crop?.image}</div>
                <h3 className="text-xl font-bold text-gray-800">{rec.crop?.name}</h3>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  CSI: {rec.csi}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Market Price:</span>
                  <span className="font-medium">₹{rec.crop?.marketPrice}/quintal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Growth Period:</span>
                  <span className="font-medium">{rec.crop?.growthDays} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disease Risk:</span>
                  <span className={`font-medium ${
                    (rec.crop?.diseaseRisk ?? 0) <= 3 ? "text-green-600" : 
                    (rec.crop?.diseaseRisk ?? 0) <= 6 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {(rec.crop?.diseaseRisk ?? 0) <= 3 ? "Low" : 
                     (rec.crop?.diseaseRisk ?? 0) <= 6 ? "Medium" : "High"}
                  </span>
                </div>
              </div>

              {/* Reasons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this crop?</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {rec.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {!recommendations && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-6">
            Click "Get Recommendations" to analyze your farm conditions and get personalized crop suggestions
          </p>
        </div>
      )}
    </div>
  );
}
