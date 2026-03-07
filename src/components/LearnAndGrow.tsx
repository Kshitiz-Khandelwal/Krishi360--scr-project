export function LearnAndGrow() {
  const learningModules = [
    {
      title: "Soil Health Management",
      description: "Learn about soil testing, pH management, and organic farming techniques",
      duration: "45 mins",
      level: "Beginner",
      category: "Soil Science",
      videoUrl: "https://www.youtube.com/watch?v=l3XBq2_Q-cw",
      topics: ["Soil pH Testing", "Organic Matter", "Nutrient Management", "Soil Conservation"],
      icon: "🌱"
    },
    {
      title: "Modern Irrigation Techniques",
      description: "Master drip irrigation, sprinkler systems, and water conservation methods",
      duration: "60 mins",
      level: "Intermediate",
      category: "Water Management",
      videoUrl: "https://www.youtube.com/watch?v=e35SQccvJg0",
      topics: ["Drip Irrigation", "Sprinkler Systems", "Water Scheduling", "Fertigation"],
      icon: "💧"
    },
    {
      title: "Integrated Pest Management",
      description: "Sustainable pest control using biological and organic methods",
      duration: "50 mins",
      level: "Intermediate",
      category: "Pest Control",
      videoUrl: "https://www.youtube.com/watch?v=lIzh9ua1iVk",
      topics: ["Biological Control", "Organic Pesticides", "Crop Rotation", "Companion Planting"],
      icon: "🦗"
    },
    {
      title: "Crop Selection & Planning",
      description: "Choose the right crops based on soil, climate, and market conditions",
      duration: "40 mins",
      level: "Beginner",
      category: "Crop Planning",
      videoUrl: "https://www.youtube.com/watch?v=szn_Nz-bPeE",
      topics: ["Soil Suitability", "Climate Matching", "Market Analysis", "Crop Rotation"],
      icon: "🌾"
    },
    {
      title: "Organic Farming Practices",
      description: "Complete guide to organic farming certification and practices",
      duration: "75 mins",
      level: "Advanced",
      category: "Organic Farming",
      videoUrl: "https://www.youtube.com/watch?v=5adnoIlbw4k",
      topics: ["Organic Certification", "Composting", "Natural Fertilizers", "Organic Pest Control"],
      icon: "🌿"
    },
    {
      title: "Post-Harvest Management",
      description: "Proper storage, processing, and value addition techniques",
      duration: "55 mins",
      level: "Intermediate",
      category: "Post Harvest",
      videoUrl: "https://www.youtube.com/watch?v=hAJnRAiMNuA",
      topics: ["Storage Techniques", "Processing", "Value Addition", "Quality Control"],
      icon: "📦"
    }
  ];

  const governmentSchemes = [
    {
      name: "PM-KISAN Samman Nidhi",
      description: "₹6,000 per year direct income support",
      link: "https://pmkisan.gov.in/",
      icon: "💰"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance for financial protection",
      link: "https://pmfby.gov.in/",
      icon: "🛡️"
    },
    {
      name: "Kisan Credit Card",
      description: "Credit facility for agricultural expenses",
      link: "https://myscheme.gov.in/schemes/kcc",
      icon: "💳"
    },
    {
      name: "Soil Health Card Scheme",
      description: "Free soil testing and recommendations",
      link: "https://soilhealth.dac.gov.in/",
      icon: "🧪"
    },
    {
      name: "PM Krishi Sinchai Yojana",
      description: "Irrigation development and water conservation",
      link: "https://pmksy.gov.in/",
      icon: "💧"
    },
    {
      name: "National Agriculture Market (e-NAM)",
      description: "Online trading platform for agricultural commodities",
      link: "https://enam.gov.in/web/Enam_ctrl/enam_registration",
      icon: "🌐"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎥 Learn & Grow</h2>
        <p className="text-gray-600">
          Enhance your farming knowledge with expert-curated video tutorials and government resources
        </p>
      </div>

      {/* Learning Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            {/* Module Header */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{module.icon}</span>
              <div className="flex flex-col gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.level === "Beginner" ? "bg-green-100 text-green-800" :
                  module.level === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {module.level}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {module.duration}
                </span>
              </div>
            </div>

            {/* Module Info */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{module.description}</p>

            {/* Topics */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">What you'll learn:</h4>
              <div className="flex flex-wrap gap-1">
                {module.topics.map((topic, topicIndex) => (
                  <span key={topicIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <a
              href={module.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>

      {/* Government Schemes Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Government Schemes & Resources</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {governmentSchemes.map((scheme, index) => (
            <a
              key={index}
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="text-2xl mb-2">{scheme.icon}</div>
              <h4 className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{scheme.name}</h4>
              <p className="text-sm text-gray-600">{scheme.description}</p>
              <div className="mt-2 text-xs text-green-600 font-medium">Learn More →</div>
            </a>
          ))}
        </div>
      </div>

      {/* Expert Tips Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Expert Tips of the Week</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌱</span>
              <h4 className="font-semibold text-gray-800">Soil Health Tip</h4>
            </div>
            <p className="text-sm text-gray-700">
              Test your soil pH every 6 months. Most crops prefer pH between 6.0-7.5. 
              Add lime to increase pH or sulfur to decrease it gradually.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💧</span>
              <h4 className="font-semibold text-gray-800">Water Management Tip</h4>
            </div>
            <p className="text-sm text-gray-700">
              Water early morning (6-8 AM) to reduce evaporation losses. 
              Check soil moisture by inserting finger 2 inches deep before watering.
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📚 Quick Reference Guides</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-medium text-gray-800 mb-1">Fertilizer Calculator</h4>
            <p className="text-sm text-gray-600">Calculate NPK requirements for your crops</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">📅</div>
            <h4 className="font-medium text-gray-800 mb-1">Crop Calendar</h4>
            <p className="text-sm text-gray-600">Seasonal planting and harvesting guide</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">🦠</div>
            <h4 className="font-medium text-gray-800 mb-1">Disease Identifier</h4>
            <p className="text-sm text-gray-600">Identify and treat common crop diseases</p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">👥 Join Our Farming Community</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">🎯 Weekly Webinars</h4>
            <p className="text-sm text-blue-700 mb-3">
              Join live sessions with agricultural experts every Tuesday at 7 PM
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Register Now
            </button>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-2">💬 Farmer Forum</h4>
            <p className="text-sm text-blue-700 mb-3">
              Connect with fellow farmers, share experiences, and get advice
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Join Forum
            </button>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Important Helplines</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">📞</div>
            <h4 className="font-medium text-gray-800 mb-1">Kisan Call Center</h4>
            <p className="text-lg font-bold text-green-600">1800-180-1551</p>
            <p className="text-sm text-gray-600">24/7 farming advice</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">🌾</div>
            <h4 className="font-medium text-gray-800 mb-1">Crop Insurance</h4>
            <p className="text-lg font-bold text-blue-600">1800-200-7710</p>
            <p className="text-sm text-gray-600">PMFBY helpline</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl mb-2">💳</div>
            <h4 className="font-medium text-gray-800 mb-1">KCC Support</h4>
            <p className="text-lg font-bold text-yellow-600">1800-270-3333</p>
            <p className="text-sm text-gray-600">Credit card queries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
