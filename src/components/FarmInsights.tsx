import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface FarmInsightsProps {
  farmer: any;
}

export function FarmInsights({ farmer }: FarmInsightsProps) {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const weatherData = useAction(api.weather.getWeatherData);
  const irrigationGuide = useQuery(api.weather.getIrrigationGuide, { 
    cropName: selectedCrop, 
    farmSize: farmer.farmSize 
  });

  // Get weather data on component mount
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  
  useEffect(() => {
    weatherData({ location: farmer.location }).then(setWeatherInfo);
  }, [farmer.location, weatherData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Farm Insights</h2>
        <p className="text-gray-600">
          Real-time weather data, irrigation guidance, and farming analytics
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weather Dashboard */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🌤️ Weather Dashboard</h3>
          
          {weatherInfo && (
            <div className="space-y-4">
              {/* Current Weather */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-800">Current Conditions</h4>
                  <span className="text-2xl">⛅</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Temperature:</span>
                    <div className="font-semibold">{weatherInfo.temperature}°C</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Humidity:</span>
                    <div className="font-semibold">{weatherInfo.humidity}%</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Wind Speed:</span>
                    <div className="font-semibold">{weatherInfo.windSpeed} km/h</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Rainfall:</span>
                    <div className="font-semibold">{weatherInfo.rainfall}mm</div>
                  </div>
                </div>
              </div>

              {/* 3-Day Forecast */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">3-Day Forecast</h4>
                <div className="space-y-2">
                  {weatherInfo.forecast.map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {day.condition === "Sunny" ? "☀️" : 
                           day.condition === "Rainy" ? "🌧️" : "⛅"}
                        </span>
                        <div>
                          <div className="font-medium">{day.day}</div>
                          <div className="text-sm text-gray-600">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{day.temp}°C</div>
                        <div className="text-sm text-gray-600">{day.rain}% rain</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Alerts */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Weather Alerts</h4>
                <div className="space-y-2">
                  {weatherInfo.alerts.map((alert: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alert.severity === "high" ? "bg-red-50 border-red-200" : 
                      alert.severity === "medium" ? "bg-yellow-50 border-yellow-200" : 
                      "bg-blue-50 border-blue-200"
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">
                          {alert.type === "irrigation" ? "💧" : 
                           alert.type === "pest" ? "🦠" : "⚠️"}
                        </span>
                        <div>
                          <div className={`font-medium ${
                            alert.severity === "high" ? "text-red-800" : 
                            alert.severity === "medium" ? "text-yellow-800" : 
                            "text-blue-800"
                          }`}>
                            {alert.type === "irrigation" ? "Irrigation Alert" : 
                             alert.type === "pest" ? "Pest Alert" : "Weather Alert"}
                          </div>
                          <div className={`text-sm ${
                            alert.severity === "high" ? "text-red-700" : 
                            alert.severity === "medium" ? "text-yellow-700" : 
                            "text-blue-700"
                          }`}>
                            {alert.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Irrigation Guide */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💧 Irrigation Guide</h3>
          
          {/* Crop Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Crop for Irrigation Analysis
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
              <option value="Potato">Potato</option>
              <option value="Onion">Onion</option>
            </select>
          </div>

          {irrigationGuide && (
            <div className="space-y-4">
              {/* Water Requirements */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Water Requirements</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Daily Water Need:</span>
                    <span className="font-semibold">{irrigationGuide.dailyWaterNeed} liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Farm Size:</span>
                    <span className="font-semibold">{farmer.farmSize} acres</span>
                  </div>
                </div>
              </div>

              {/* Irrigation Methods */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Irrigation Methods Comparison</h4>
                <div className="space-y-3">
                  {Object.entries(irrigationGuide.methods).map(([method, details]: [string, any]) => (
                    <div key={method} className={`p-3 rounded-lg border ${
                      irrigationGuide.recommendation === method ? 
                      "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium capitalize">{method} Irrigation</h5>
                        {irrigationGuide.recommendation === method && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Efficiency:</span>
                          <span className="font-medium">{details.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Water Saved:</span>
                          <span className="font-medium">{details.waterSaved}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <strong>Cost:</strong> {details.cost}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Best for:</strong> {details.suitability}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Irrigation Schedule */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">💡 Smart Irrigation Tips</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Best irrigation time: Early morning (6-8 AM) or evening (4-6 PM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Check soil moisture before watering - stick finger 2 inches deep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Reduce watering frequency during rainy season</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Use mulching to reduce water evaporation by 30-40%</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Soil Health Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🌱 Soil Health Analysis</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* pH Analysis */}
          <div className="text-center">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="font-semibold text-gray-800 mb-2">Soil pH</h4>
            <div className="text-2xl font-bold text-green-600 mb-2">{farmer.soilPh}</div>
            <div className={`text-sm px-3 py-1 rounded-full ${
              farmer.soilPh >= 6.0 && farmer.soilPh <= 7.5 ? 
              "bg-green-100 text-green-800" : 
              "bg-yellow-100 text-yellow-800"
            }`}>
              {farmer.soilPh >= 6.0 && farmer.soilPh <= 7.5 ? "Optimal" : "Needs Attention"}
            </div>
          </div>

          {/* Soil Type */}
          <div className="text-center">
            <div className="text-3xl mb-2">🏔️</div>
            <h4 className="font-semibold text-gray-800 mb-2">Soil Type</h4>
            <div className="text-lg font-medium text-gray-700 mb-2 capitalize">{farmer.soilType}</div>
            <div className="text-sm text-gray-600">
              {farmer.soilType === "loam" ? "Excellent for most crops" :
               farmer.soilType === "clay" ? "Good water retention" :
               farmer.soilType === "sandy" ? "Good drainage" : "Balanced properties"}
            </div>
          </div>

          {/* Climate Suitability */}
          <div className="text-center">
            <div className="text-3xl mb-2">🌡️</div>
            <h4 className="font-semibold text-gray-800 mb-2">Climate</h4>
            <div className="text-sm text-gray-700 mb-2">
              {farmer.temperature.min}°C - {farmer.temperature.max}°C
            </div>
            <div className="text-sm text-gray-600">
              {farmer.rainfall}mm annual rainfall
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Soil Improvement Tips</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Add organic compost to improve soil structure and fertility</li>
            <li>• Test soil nutrients (NPK) every 6 months for optimal crop growth</li>
            <li>• Consider crop rotation to maintain soil health naturally</li>
            <li>• Use cover crops during off-season to prevent soil erosion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
