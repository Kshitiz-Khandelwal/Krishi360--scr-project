import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PastCrops() {
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [newCrop, setNewCrop] = useState({
    cropName: "",
    plantedDate: "",
    harvestedDate: "",
    quantity: "",
    pricePerKg: "",
    totalRevenue: "",
    buyer: "",
    notes: ""
  });

  const pastCrops = useQuery(api.pastCrops.getPastCrops) || [];
  const addPastCrop = useMutation(api.pastCrops.addPastCrop);

  const cropOptions = [
    { value: "🧅 Onion", emoji: "🧅", name: "Onion" },
    { value: "🥔 Potato", emoji: "🥔", name: "Potato" },
    { value: "🌽 Maize", emoji: "🌽", name: "Maize" },
    { value: "🌾 Rice", emoji: "🌾", name: "Rice" },
    { value: "🌾 Wheat", emoji: "🌾", name: "Wheat" },
    { value: "🍅 Tomato", emoji: "🍅", name: "Tomato" },
    { value: "🥕 Carrot", emoji: "🥕", name: "Carrot" },
    { value: "🥬 Cabbage", emoji: "🥬", name: "Cabbage" },
    { value: "🥬 Spinach", emoji: "🥬", name: "Spinach" },
    { value: "🫘 Pulses", emoji: "🫘", name: "Pulses" },
    { value: "🍌 Banana", emoji: "🍌", name: "Banana" },
    { value: "🍎 Apple", emoji: "🍎", name: "Apple" },
    { value: "🥭 Mango", emoji: "🥭", name: "Mango" },
    { value: "🍊 Orange", emoji: "🍊", name: "Orange" },
    { value: "🌶️ Chili", emoji: "🌶️", name: "Chili" },
    { value: "🥒 Cucumber", emoji: "🥒", name: "Cucumber" }
  ];

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPastCrop({
        cropName: newCrop.cropName,
        plantedDate: new Date(newCrop.plantedDate).getTime(),
        harvestedDate: new Date(newCrop.harvestedDate).getTime(),
        quantity: parseFloat(newCrop.quantity),
        pricePerKg: parseFloat(newCrop.pricePerKg),
        totalRevenue: parseFloat(newCrop.totalRevenue),
        buyer: newCrop.buyer || undefined,
        notes: newCrop.notes || undefined
      });
      setNewCrop({
        cropName: "",
        plantedDate: "",
        harvestedDate: "",
        quantity: "",
        pricePerKg: "",
        totalRevenue: "",
        buyer: "",
        notes: ""
      });
      setIsAddingCrop(false);
    } catch (error) {
      console.error("Failed to add past crop:", error);
    }
  };

  const getCropIcon = (cropName: string) => {
    const crop = cropOptions.find(c => c.value === cropName);
    return crop ? crop.emoji : "🌱";
  };

  const getCropDisplayName = (cropName: string) => {
    return cropName; // Already includes emoji
  };

  const calculateProfit = (revenue: number, quantity: number) => {
    // Assuming 30% of revenue as costs (seeds, fertilizer, labor, etc.)
    const estimatedCosts = revenue * 0.3;
    return revenue - estimatedCosts;
  };

  const totalStats = pastCrops.reduce((acc, crop) => {
    acc.totalRevenue += crop.totalRevenue;
    acc.totalQuantity += crop.quantity;
    acc.totalProfit += calculateProfit(crop.totalRevenue, crop.quantity);
    return acc;
  }, { totalRevenue: 0, totalQuantity: 0, totalProfit: 0 });

  // Calculate seasonal summary
  const seasonalSummary = pastCrops.reduce((acc, crop) => {
    const year = new Date(crop.plantedDate).getFullYear();
    const season = getSeasonFromDate(crop.plantedDate);
    const key = `${year}-${season}`;
    
    if (!acc[key]) {
      acc[key] = { revenue: 0, crops: [], year, season };
    }
    acc[key].revenue += crop.totalRevenue;
    acc[key].crops.push(crop.cropName);
    return acc;
  }, {} as Record<string, { revenue: number, crops: string[], year: number, season: string }>);

  // Find most profitable crop
  const cropProfitability = pastCrops.reduce((acc, crop) => {
    const cropName = crop.cropName;
    if (!acc[cropName]) {
      acc[cropName] = { totalRevenue: 0, totalQuantity: 0, count: 0 };
    }
    acc[cropName].totalRevenue += crop.totalRevenue;
    acc[cropName].totalQuantity += crop.quantity;
    acc[cropName].count += 1;
    return acc;
  }, {} as Record<string, { totalRevenue: number, totalQuantity: number, count: number }>);

  const mostProfitableCrop = Object.entries(cropProfitability)
    .sort(([,a], [,b]) => (b.totalRevenue / b.count) - (a.totalRevenue / a.count))[0];

  function getSeasonFromDate(timestamp: number): string {
    const month = new Date(timestamp).getMonth() + 1;
    if (month >= 3 && month <= 5) return "Spring";
    if (month >= 6 && month <= 8) return "Summer";
    if (month >= 9 && month <= 11) return "Autumn";
    return "Winter";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Past Crops Log</h2>
            <p className="text-gray-600">
              Track your farming history, analyze performance, and learn from past harvests
            </p>
          </div>
          <div className="flex gap-3">
            {pastCrops.length > 0 && (
              <button
                onClick={() => setShowSummary(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                📈 View Summary
              </button>
            )}
            <button
              onClick={() => setIsAddingCrop(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              + Add Crop Record
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {pastCrops.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Revenue</h3>
            <div className="text-2xl font-bold text-green-600">₹{totalStats.totalRevenue.toLocaleString()}</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Harvest</h3>
            <div className="text-2xl font-bold text-blue-600">{totalStats.totalQuantity.toLocaleString()} kg</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Estimated Profit</h3>
            <div className="text-2xl font-bold text-purple-600">₹{totalStats.totalProfit.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Visual Timeline */}
      {pastCrops.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌿 Visual Timeline</h3>
          <div className="flex flex-wrap gap-2">
            {pastCrops
              .sort((a, b) => a.plantedDate - b.plantedDate)
              .map((crop, index) => (
                <div
                  key={crop._id}
                  className="flex items-center gap-2 bg-green-50 rounded-lg p-2 border border-green-200"
                  title={`${getCropDisplayName(crop.cropName)} - ${new Date(crop.plantedDate).toLocaleDateString()}`}
                >
                  <span className="text-2xl">{getCropIcon(crop.cropName)}</span>
                  <div className="text-xs">
                    <div className="font-medium">{new Date(crop.plantedDate).getFullYear()}</div>
                    <div className="text-gray-600">{getSeasonFromDate(crop.plantedDate)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">📈 Farming Summary</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Seasonal Income */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">💰 Income Per Season</h4>
                <div className="space-y-2">
                  {Object.entries(seasonalSummary)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([key, data]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{data.season} {data.year}</div>
                          <div className="text-sm text-gray-600">
                            {[...new Set(data.crops)].map(crop => getCropIcon(crop)).join(' ')}
                          </div>
                        </div>
                        <div className="font-bold text-green-600">₹{data.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Most Profitable Crop */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🏆 Most Profitable Crop</h4>
                {mostProfitableCrop && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getCropIcon(mostProfitableCrop[0])}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{getCropDisplayName(mostProfitableCrop[0])}</div>
                        <div className="text-sm text-gray-600">
                          Avg. Revenue: ₹{Math.round(mostProfitableCrop[1].totalRevenue / mostProfitableCrop[1].count).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Grown {mostProfitableCrop[1].count} times • Total: ₹{mostProfitableCrop[1].totalRevenue.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Average Yield */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 Average Yield</h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {pastCrops.length > 0 ? Math.round(totalStats.totalQuantity / pastCrops.length) : 0} kg
                    </div>
                    <div className="text-sm text-gray-600">per harvest</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {isAddingCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add Past Crop Record</h3>
              <button
                onClick={() => setIsAddingCrop(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Name *
                  </label>
                  <select
                    value={newCrop.cropName}
                    onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a crop</option>
                    {cropOptions.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planted Date *
                  </label>
                  <input
                    type="date"
                    value={newCrop.plantedDate}
                    onChange={(e) => setNewCrop({ ...newCrop, plantedDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harvested Date *
                  </label>
                  <input
                    type="date"
                    value={newCrop.harvestedDate}
                    onChange={(e) => setNewCrop({ ...newCrop, harvestedDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Harvested (kg) *
                  </label>
                  <input
                    type="number"
                    value={newCrop.quantity}
                    onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                    required
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 1500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per kg (₹) *
                  </label>
                  <input
                    type="number"
                    value={newCrop.pricePerKg}
                    onChange={(e) => setNewCrop({ ...newCrop, pricePerKg: e.target.value })}
                    required
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Revenue (₹) *
                  </label>
                  <input
                    type="number"
                    value={newCrop.totalRevenue}
                    onChange={(e) => setNewCrop({ ...newCrop, totalRevenue: e.target.value })}
                    required
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 37500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buyer (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCrop.buyer}
                    onChange={(e) => setNewCrop({ ...newCrop, buyer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Local Market, Trader Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newCrop.notes}
                  onChange={(e) => setNewCrop({ ...newCrop, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any observations, challenges, or lessons learned..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingCrop(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crops List */}
      {pastCrops.length > 0 ? (
        <div className="space-y-4">
          {pastCrops.map((crop) => (
            <div key={crop._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getCropIcon(crop.cropName)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{getCropDisplayName(crop.cropName)}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📅 Planted: {new Date(crop.plantedDate).toLocaleDateString()}</div>
                      <div>🌾 Harvested: {new Date(crop.harvestedDate).toLocaleDateString()}</div>
                      <div>⏱️ Duration: {Math.ceil((crop.harvestedDate - crop.plantedDate) / (1000 * 60 * 60 * 24))} days</div>
                      {crop.buyer && <div>🏪 Buyer: {crop.buyer}</div>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">₹{crop.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">{crop.quantity} kg</div>
                  <div className="text-sm text-gray-600">Quantity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">₹{crop.pricePerKg}</div>
                  <div className="text-sm text-gray-600">Price/kg</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">₹{calculateProfit(crop.totalRevenue, crop.quantity).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Est. Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{((crop.totalRevenue / crop.quantity) * 100 / crop.pricePerKg).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
              </div>

              {crop.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">📝 Notes:</h4>
                  <p className="text-sm text-gray-600">{crop.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Past Crops Recorded</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your farming history to analyze performance and improve future harvests
          </p>
          <button
            onClick={() => setIsAddingCrop(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add Your First Crop Record
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Why Track Past Crops?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">📈 Performance Analysis</h4>
            <ul className="space-y-1">
              <li>• Compare yields across seasons</li>
              <li>• Identify most profitable crops</li>
              <li>• Track price trends over time</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Better Planning</h4>
            <ul className="space-y-1">
              <li>• Learn from past experiences</li>
              <li>• Optimize crop selection</li>
              <li>• Improve resource allocation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
