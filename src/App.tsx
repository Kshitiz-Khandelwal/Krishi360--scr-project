import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { FarmerSetup } from "./components/FarmerSetup";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-xl font-bold text-green-700">Krishi360</h1>
              <p className="text-xs text-green-600">Complete Farming, Complete Prosperity</p>
            </div>
          </div>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Authenticated>
          <AuthenticatedContent />
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedContent />
        </Unauthenticated>
      </main>
      
      <Toaster />
    </div>
  );
}

function AuthenticatedContent() {
  const farmer = useQuery(api.farmers.getCurrentFarmer);
  
  if (farmer === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!farmer) {
    return <FarmerSetup />;
  }

  return <Dashboard farmer={farmer} />;
}

function UnauthenticatedContent() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-4xl font-bold text-green-700 mb-2">Krishi360</h1>
        <p className="text-lg text-green-600 mb-4">Complete Farming, Complete Prosperity</p>
        <p className="text-gray-600">
          Get personalized crop recommendations, weather alerts, and farming guidance
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
