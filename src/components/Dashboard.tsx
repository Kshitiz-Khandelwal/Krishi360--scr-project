import { useState } from "react";
import { FarmInsights } from "./FarmInsights";
import { CropRecommendations } from "./CropRecommendations";
import { ChatBot } from "./ChatBot";
import { LearnAndGrow } from "./LearnAndGrow";
import { SchemesSupport } from "./SchemesSupport";
import { Information } from "./Information";
import { Marketplace } from "./Marketplace";
import { PastCrops } from "./PastCrops";
import { Sidebar } from "./ui/dashboard-with-collapsible-sidebar";

interface DashboardProps {
  farmer: any;
}

export function Dashboard({ farmer }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showChatBot, setShowChatBot] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    "English", "हिंदी", "বাংলা", "தமிழ்", "తెలుగు", "ಕನ್ನಡ",
    "മലയാളം", "ગુજરાતી", "ਪੰਜਾਬੀ", "मराठी", "ଓଡ଼ିଆ"
  ];

  const tabs = [
    { id: "overview", label: "🏠 Overview", icon: "🏠" },
    { id: "insights", label: "📊 Farm Insights", icon: "📊" },
    { id: "recommendations", label: "🌿 Crop Recommendations", icon: "🌿" },
    { id: "marketplace", label: "🛒 Marketplace", icon: "🛒" },
    { id: "pastcrops", label: "📊 Past Crops", icon: "📊" },
    { id: "learn", label: "🎥 Learn & Grow", icon: "🎥" },
    { id: "schemes", label: "🏛️ Schemes & Support", icon: "🏛️" },
    { id: "information", label: "ℹ️ Information", icon: "ℹ️" },
  ];

  const quickActions = [
    {
      title: "Get Crop Recommendations",
      description: "AI-powered crop suggestions for your farm",
      icon: "🌱",
      action: () => setActiveTab("Crop Recommendations"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Check Weather Alerts",
      description: "Real-time weather updates and farming alerts",
      icon: "🌤️",
      action: () => setActiveTab("Farm Insights"),
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "Browse Marketplace",
      description: "Buy supplies or sell your crops",
      icon: "🛒",
      action: () => setActiveTab("Marketplace"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Track Past Harvests",
      description: "Analyze your farming performance",
      icon: "📊",
      action: () => setActiveTab("Past Crops"),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const expertTips = [
    {
      icon: "🌱",
      title: "Soil Health Tip",
      tip: "Test your soil pH every 6 months. Most crops prefer pH between 6.0-7.5. Add lime to increase pH or sulfur to decrease it gradually."
    },
    {
      icon: "💧",
      title: "Water Management Tip",
      tip: "Water early morning (6-8 AM) to reduce evaporation losses. Check soil moisture by inserting finger 2 inches deep before watering."
    },
    {
      icon: "💰",
      title: "Finance Management Tip",
      tip: "Keep detailed records of all expenses and income. Use the 50-30-20 rule: 50% for operations, 30% for improvements, 20% for savings."
    },
    {
      icon: "🌾",
      title: "Fertilizer Management Tip",
      tip: "Apply fertilizers based on soil test results. Over-fertilization can harm crops and pollute groundwater. Follow the 4R principle: Right source, Right rate, Right time, Right place."
    }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
      <Sidebar selected={activeTab} setSelected={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 h-full overflow-y-auto">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200">
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Welcome back, {farmer.name.replace(/\b\w/g, (l: string) => l.toUpperCase())}! 🌾
              </h1>
              <p className="text-gray-600">
                Your farm dashboard is ready with personalized insights and recommendations
              </p>
            </div>

            {/* Farm Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200 text-center">
                <div className="text-3xl mb-2">🏞️</div>
                <h3 className="text-lg font-semibold text-gray-800">Farm Size</h3>
                <div className="text-2xl font-bold text-green-600">{farmer.farmSize} acres</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200 text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="text-lg font-semibold text-gray-800">Soil Type</h3>
                <div className="text-lg font-medium text-gray-700 capitalize">{farmer.soilType}</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200 text-center">
                <div className="text-3xl mb-2">🧪</div>
                <h3 className="text-lg font-semibold text-gray-800">Soil pH</h3>
                <div className="text-2xl font-bold text-blue-600">{farmer.soilPh}</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200 text-center">
                <div className="text-3xl mb-2">🌧️</div>
                <h3 className="text-lg font-semibold text-gray-800">Rainfall</h3>
                <div className="text-lg font-medium text-gray-700">{farmer.rainfall}mm/year</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`p-4 rounded-lg text-white hover:scale-105 transition transform shadow-md ${action.color}`}
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Expert Tips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Expert Tips of the Week</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {expertTips.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">🌱</span>
                  <div>
                    <div className="font-medium text-gray-800">Profile Setup Complete</div>
                    <div className="text-sm text-gray-600">Your farm profile is ready for personalized recommendations</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-lg">🌤️</span>
                  <div>
                    <div className="font-medium text-gray-800">Weather Data Available</div>
                    <div className="text-sm text-gray-600">Check the Farm Insights tab for current weather conditions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-lg">🎯</span>
                  <div>
                    <div className="font-medium text-gray-800">Ready for Crop Recommendations</div>
                    <div className="text-sm text-gray-600">Generate AI-powered crop suggestions based on your farm data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Farm Insights" && <FarmInsights farmer={farmer} />}
        {activeTab === "Crop Recommendations" && <CropRecommendations />}
        {activeTab === "Marketplace" && <Marketplace />}
        {activeTab === "Past Crops" && <PastCrops />}
        {activeTab === "Learn & Grow" && <LearnAndGrow />}
        {activeTab === "Schemes & Support" && <SchemesSupport />}
        {activeTab === "Settings" && <Information />}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-40"
      >
        <span className="text-xl">🤖</span>
      </button>

      {/* Chat Bot */}
      {showChatBot && (
        <div className="fixed bottom-20 right-6 w-96 z-50">
          <ChatBot onClose={() => setShowChatBot(false)} />
        </div>
      )}
    </div>
  );
}
