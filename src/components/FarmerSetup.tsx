import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import indiaLocations from "../data/indiaLocations.json";

export function FarmerSetup() {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    city: "",
    location: "",
    farmSize: "",
    soilType: "",
    soilPh: "",
    rainfall: "",
    minTemp: "",
    maxTemp: "",
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const createFarmer = useMutation(api.farmers.createOrUpdateFarmer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soil types covering all Indian categories
  const soilTypes = [
    "Alluvial Soil",
    "Black (Regur) Soil",
    "Red Soil",
    "Laterite Soil",
    "Arid (Desert) Soil",
    "Saline and Alkaline Soil",
    "Peaty and Marshy Soil",
    "Forest and Mountain Soil",
    "Sandy Soil",
    "Loamy Soil",
    "Clay Soil",
    "Sandy Loam Soil",
    "Clay Loam Soil",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createFarmer({
        name: formData.name,
        location: formData.location,
        farmSize: parseFloat(formData.farmSize),
        soilType: formData.soilType,
        soilPh: parseFloat(formData.soilPh),
        rainfall: parseFloat(formData.rainfall),
        minTemp: parseFloat(formData.minTemp),
        maxTemp: parseFloat(formData.maxTemp),
      });
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error("Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "state") {
      const selectedState = indiaLocations.find((s) => s.name === value);
      setDistricts(selectedState ? selectedState.districts.map((d: any) => d.name) : []);
      setFormData({ ...formData, state: value, city: "", location: value });
    } else if (name === "city") {
      setFormData({ ...formData, city: value, location: `${value}, ${formData.state}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce">👨‍🌾</div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Welcome to Krishi360!</h2>
          <p className="text-gray-600">
            Set up your farm profile for tailored recommendations 🌾
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select your state</option>
                {indiaLocations.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!formData.state}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select your district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Farm size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size (acres) *
              </label>
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                required
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 2.5"
              />
            </div>

            {/* Soil type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type *</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select soil type</option>
                {soilTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Soil pH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil pH *</label>
              <input
                type="number"
                name="soilPh"
                value={formData.soilPh}
                onChange={handleChange}
                required
                step="0.1"
                min="4"
                max="9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 6.5"
              />
            </div>

            {/* Rainfall */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rainfall (mm) *
              </label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 800"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Temperature (°C) *
              </label>
              <input
                type="number"
                name="minTemp"
                value={formData.minTemp}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Temperature (°C) *
              </label>
              <input
                type="number"
                name="maxTemp"
                value={formData.maxTemp}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 35"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
