import { useState } from "react";

export function SchemesSupport() {
  const schemes = [
    {
      id: 1,
      name: "PM-KISAN Samman Nidhi",
      category: "Financial Support",
      description: "₹6,000 per year direct income support to farmer families",
      eligibility: "Small and marginal farmers with cultivable land",
      benefits: "₹2,000 every 4 months",
      applicationProcess: "Online through PM-KISAN portal or CSC centers",
      documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
      status: "Active",
      icon: "💰",
      link: "https://pmkisan.gov.in/"
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      category: "Insurance",
      description: "Crop insurance scheme providing financial support against crop loss",
      eligibility: "All farmers growing notified crops in notified areas",
      benefits: "Up to ₹2 lakh coverage per farmer per season",
      applicationProcess: "Through banks, insurance companies, or online portal",
      documents: ["Aadhaar Card", "Bank Account", "Land Records", "Sowing Certificate"],
      status: "Active",
      icon: "🛡️",
      link: "https://pmfby.gov.in/"
    },
    {
      id: 3,
      name: "Kisan Credit Card (KCC)",
      category: "Credit",
      description: "Credit facility for farmers to meet agricultural expenses",
      eligibility: "All farmers including tenant farmers and sharecroppers",
      benefits: "Credit up to ₹3 lakh at 4% interest rate",
      applicationProcess: "Apply at nearest bank branch with required documents",
      documents: ["Identity Proof", "Address Proof", "Land Documents", "Income Proof"],
      status: "Active",
      icon: "💳",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
      id: 4,
      name: "Soil Health Card Scheme",
      category: "Technical Support",
      description: "Provides soil health information and nutrient recommendations",
      eligibility: "All farmers across the country",
      benefits: "Free soil testing and customized fertilizer recommendations",
      applicationProcess: "Contact local agriculture department or KVK",
      documents: ["Land Records", "Farmer ID"],
      status: "Active",
      icon: "🧪",
      link: "https://soilhealth.dac.gov.in/"
    },
    {
      id: 5,
      name: "National Agriculture Market (e-NAM)",
      category: "Marketing",
      description: "Online trading platform for agricultural commodities",
      eligibility: "All farmers and traders",
      benefits: "Better price discovery and transparent trading",
      applicationProcess: "Register online on e-NAM portal",
      documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
      status: "Active",
      icon: "📱",
      link: "https://enam.gov.in/web/Enam_ctrl/enam_registration"
    },
    {
      id: 6,
      name: "Pradhan Mantri Krishi Sinchai Yojana",
      category: "Infrastructure",
      description: "Irrigation support scheme - 'Per Drop More Crop'",
      eligibility: "All categories of farmers",
      benefits: "Subsidy on drip/sprinkler irrigation systems",
      applicationProcess: "Apply through state agriculture department",
      documents: ["Land Records", "Bank Account", "Aadhaar Card"],
      status: "Active",
      icon: "💧",
      link: "https://pmksy.gov.in/"
    }
  ];

  const categories = ["All", "Financial Support", "Insurance", "Credit", "Technical Support", "Marketing", "Infrastructure"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🏛️ Government Schemes & Support</h2>
        <p className="text-gray-600">
          Explore government schemes, subsidies, and support programs available for farmers
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scheme.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{scheme.name}</h3>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {scheme.category}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">{scheme.status}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">{scheme.description}</p>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">💰 Benefits</h4>
                <p className="text-sm text-gray-600">{scheme.benefits}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">✅ Eligibility</h4>
                <p className="text-sm text-gray-600">{scheme.eligibility}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">📋 Required Documents</h4>
                <div className="flex flex-wrap gap-1">
                  {scheme.documents.map((doc, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">📝 How to Apply</h4>
                <p className="text-sm text-gray-600">{scheme.applicationProcess}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Learn More & Apply
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Schemes Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter</p>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📞 Need Help?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Kisan Call Center</h4>
            <p className="text-blue-700">📞 1800-180-1551 (Toll Free)</p>
            <p className="text-blue-600">Available 24x7 in local languages</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">PM-KISAN Helpline</h4>
            <p className="text-blue-700">📞 155261 / 1800-115-526</p>
            <p className="text-blue-600">For PM-KISAN related queries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
