export function Information() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ℹ️ Information Hub</h2>
        <p className="text-gray-600">
          Learn about our technology, formulas, and the APIs that power Krishi360
        </p>
      </div>

      {/* CSI Formula Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Crop Suitability Index (CSI)</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Formula Breakdown</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>CSI = Σ(wᵢ × Fᵢᵖ)</strong></p>
              <p>Where:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>wᵢ</strong> = Weight of factor i</li>
                <li><strong>Fᵢᵖ</strong> = Performance score of factor i</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Factor Weights</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>Soil Compatibility:</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Climate Match:</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Price:</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Disease Resistance:</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Efficiency:</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Score Interpretation</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <div className="flex justify-between">
                  <span>90-100:</span>
                  <span className="font-medium">Excellent Match</span>
                </div>
                <div className="flex justify-between">
                  <span>70-89:</span>
                  <span className="font-medium">Good Option</span>
                </div>
                <div className="flex justify-between">
                  <span>50-69:</span>
                  <span className="font-medium">Consider with Care</span>
                </div>
                <div className="flex justify-between">
                  <span>Below 50:</span>
                  <span className="font-medium">Not Recommended</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APIs Used Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🔌 APIs & Data Sources</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌤️</span>
              <h4 className="font-semibold text-gray-800">OpenWeatherMap API</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Provides real-time weather data, forecasts, and climate information
            </p>
            <div className="text-xs text-gray-500">
              <strong>Features:</strong> Current weather, 5-day forecast, weather alerts
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛰️</span>
              <h4 className="font-semibold text-gray-800">Bhuvan API</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              ISRO's geospatial platform for soil and land use data
            </p>
            <div className="text-xs text-gray-500">
              <strong>Features:</strong> Soil mapping, land classification, crop monitoring
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📈</span>
              <h4 className="font-semibold text-gray-800">AgriMarket API</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Real-time market prices and commodity trading data
            </p>
            <div className="text-xs text-gray-500">
              <strong>Features:</strong> Mandi prices, price trends, market analysis
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <h4 className="font-semibold text-gray-800">Grok AI API</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              AI-powered farming assistant for personalized advice
            </p>
            <div className="text-xs text-gray-500">
              <strong>Features:</strong> Crop guidance, pest identification, farming tips
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Technology Stack</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">⚛️</div>
            <h4 className="font-semibold text-blue-800 mb-2">Frontend</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>React 18</div>
              <div>TypeScript</div>
              <div>Tailwind CSS</div>
              <div>Vite</div>
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">🔥</div>
            <h4 className="font-semibold text-green-800 mb-2">Backend</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>Convex Database</div>
              <div>Real-time Sync</div>
              <div>Convex Auth</div>
              <div>Serverless Functions</div>
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🐍</div>
            <h4 className="font-semibold text-purple-800 mb-2">Analytics</h4>
            <div className="text-sm text-purple-700 space-y-1">
              <div>Python Scripts</div>
              <div>Machine Learning</div>
              <div>Data Processing</div>
              <div>Predictive Models</div>
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation Types Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💧 Irrigation Methods</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💧</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">Drip Irrigation</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Water is delivered directly to plant roots through a network of tubes and emitters.
                </p>
                <div className="grid md:grid-cols-3 gap-2 text-xs">
                  <div><strong>Efficiency:</strong> 85-95%</div>
                  <div><strong>Water Savings:</strong> 40-50%</div>
                  <div><strong>Best for:</strong> Water-scarce areas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌊</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">Flood Irrigation</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Traditional method where water flows over the soil surface to reach plant roots.
                </p>
                <div className="grid md:grid-cols-3 gap-2 text-xs">
                  <div><strong>Efficiency:</strong> 50-70%</div>
                  <div><strong>Water Savings:</strong> 0%</div>
                  <div><strong>Best for:</strong> Rice, large fields</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚿</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">Sprinkler Irrigation</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Water is sprayed through the air to simulate rainfall over the crop area.
                </p>
                <div className="grid md:grid-cols-3 gap-2 text-xs">
                  <div><strong>Efficiency:</strong> 70-85%</div>
                  <div><strong>Water Savings:</strong> 20-30%</div>
                  <div><strong>Best for:</strong> Medium-sized fields</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Additional Resources</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">📖 Documentation</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• API Integration Guide</li>
              <li>• CSI Calculation Methods</li>
              <li>• Data Sources & Accuracy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🔗 External Links</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• OpenWeatherMap Documentation</li>
              <li>• ISRO Bhuvan Portal</li>
              <li>• Government Agriculture Schemes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
