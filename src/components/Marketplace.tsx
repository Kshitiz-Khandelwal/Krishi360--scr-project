import { useState } from "react";

export function Marketplace() {
  const [activeTab, setActiveTab] = useState<"shop" | "sell" | "expiring">("shop");

  const shopItems = [
    {
      id: 1,
      name: "NPK Fertilizer (50kg)",
      category: "Fertilizer",
      price: 1200,
      originalPrice: 1400,
      image: "🌱",
      rating: 4.5,
      seller: "AgriSupply Co.",
      inStock: true,
      description: "High-quality NPK fertilizer for all crops"
    },
    {
      id: 2,
      name: "Hybrid Tomato Seeds",
      category: "Seeds",
      price: 450,
      originalPrice: 500,
      image: "🍅",
      rating: 4.8,
      seller: "SeedMart",
      inStock: true,
      description: "Disease-resistant hybrid tomato variety"
    },
    {
      id: 3,
      name: "Organic Pesticide (1L)",
      category: "Pesticide",
      price: 800,
      originalPrice: 900,
      image: "🦗",
      rating: 4.3,
      seller: "EcoFarm Solutions",
      inStock: false,
      description: "Organic pest control solution"
    },
    {
      id: 4,
      name: "Drip Irrigation Kit",
      category: "Equipment",
      price: 5500,
      originalPrice: 6000,
      image: "💧",
      rating: 4.7,
      seller: "IrrigationPro",
      inStock: true,
      description: "Complete drip irrigation system for 1 acre"
    }
  ];

  const myListings = [
    {
      id: 1,
      crop: "Onions",
      quantity: "500 kg",
      pricePerKg: 25,
      image: "🧅",
      status: "Active",
      views: 45,
      inquiries: 8,
      postedDate: "2 days ago"
    },
    {
      id: 2,
      crop: "Potatoes",
      quantity: "1000 kg",
      pricePerKg: 18,
      image: "🥔",
      status: "Sold",
      views: 120,
      inquiries: 15,
      postedDate: "1 week ago"
    }
  ];

  const expiringCrops = [
    {
      id: 1,
      farmer: "Rajesh Kumar",
      crop: "Tomatoes",
      quantity: "200 kg",
      pricePerKg: 15,
      originalPrice: 25,
      image: "🍅",
      daysLeft: 2,
      location: "Pune, Maharashtra",
      contact: "+91 98765 43210"
    },
    {
      id: 2,
      farmer: "Sunita Devi",
      crop: "Leafy Vegetables",
      quantity: "50 kg",
      pricePerKg: 20,
      originalPrice: 35,
      image: "🥬",
      daysLeft: 1,
      location: "Delhi NCR",
      contact: "+91 87654 32109"
    },
    {
      id: 3,
      farmer: "Mohan Singh",
      crop: "Bananas",
      quantity: "300 kg",
      pricePerKg: 12,
      originalPrice: 20,
      image: "🍌",
      daysLeft: 3,
      location: "Bangalore, Karnataka",
      contact: "+91 76543 21098"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🛒 Marketplace</h2>
        <p className="text-gray-600">
          Buy farming supplies, sell your crops, and find expiring produce at discounted rates
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "shop"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🛍️ Shop
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "sell"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            💰 Sell
          </button>
          <button
            onClick={() => setActiveTab("expiring")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "expiring"
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⏰ Expiring Soon
          </button>
        </div>

        <div className="p-6">
          {/* Shop Tab */}
          {activeTab === "shop" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select className="md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">All Categories</option>
                  <option value="fertilizer">Fertilizers</option>
                  <option value="seeds">Seeds</option>
                  <option value="pesticide">Pesticides</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{item.image}</div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">by {item.seller}</div>
                    </div>

                    <button
                      disabled={!item.inStock}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        item.inStock
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sell Tab */}
          {activeTab === "sell" && (
            <div className="space-y-6">
              {/* Add New Listing */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">📝 List Your Crop</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Crop name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Quantity (kg)"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Price per kg (₹)"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    List Crop
                  </button>
                </div>
              </div>

              {/* My Listings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 My Listings</h3>
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{listing.image}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{listing.crop}</h4>
                            <p className="text-sm text-gray-600">{listing.quantity} • ₹{listing.pricePerKg}/kg</p>
                            <p className="text-xs text-gray-500">Posted {listing.postedDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {listing.status}
                          </span>
                          <div className="text-sm text-gray-600 mt-1">
                            {listing.views} views • {listing.inquiries} inquiries
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expiring Soon Tab */}
          {activeTab === "expiring" && (
            <div className="space-y-6">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">⚡ Quick Deals - Limited Time!</h3>
                <p className="text-sm text-orange-700">
                  Help farmers reduce waste while getting fresh produce at discounted prices. 
                  Perfect for restaurants, events, and bulk buyers.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiringCrops.map((crop) => (
                  <div key={crop.id} className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{crop.image}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        crop.daysLeft === 1 
                          ? "bg-red-200 text-red-800" 
                          : crop.daysLeft === 2 
                          ? "bg-orange-200 text-orange-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}>
                        {crop.daysLeft} day{crop.daysLeft > 1 ? 's' : ''} left
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-1">{crop.crop}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {crop.farmer}</p>
                    <p className="text-sm text-gray-600 mb-3">📍 {crop.location}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="font-medium">{crop.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <div>
                          <span className="font-bold text-green-600">₹{crop.pricePerKg}/kg</span>
                          <span className="text-xs text-gray-500 line-through ml-2">₹{crop.originalPrice}</span>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Save ₹{crop.originalPrice - crop.pricePerKg}/kg ({Math.round((1 - crop.pricePerKg/crop.originalPrice) * 100)}% off)
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                        Contact Farmer
                      </button>
                      <div className="text-center text-xs text-gray-600">
                        📞 {crop.contact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Perfect for:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>🍽️ Restaurants:</strong> Fresh ingredients at lower costs
                  </div>
                  <div>
                    <strong>🎉 Event Caterers:</strong> Bulk quantities for events
                  </div>
                  <div>
                    <strong>🏪 Retailers:</strong> Quick turnover products
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
