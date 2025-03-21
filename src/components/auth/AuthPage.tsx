import React from "react";
import AuthForm from "./AuthForm";
import { Briefcase, Users, Coins, MessageCircle, Sparkles } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-200 flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                SE
              </span>
            </div>
            <h1 className="text-xl font-bold">SkillExchange</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              How It Works
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-12 gap-8">
        {/* Left Column - Features */}
        <div className="md:w-1/2 space-y-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Empowering Skills, Transforming Communities
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Make Skills,</span>
              <span className="block text-primary">Make Friends,</span>
              <span className="block">Make Progress!</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Jump into a platform where you control your skills, stack up
              virtual coins, and connect with an awesome community. Your future
              starts here!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Request/Offer Board
              </h3>
              <p className="text-gray-600 text-sm">
                Browse and post help requests or offers filtered by category
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Coin Management</h3>
              <p className="text-gray-600 text-sm">
                Track your virtual coins and transaction history
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">User Profiles</h3>
              <p className="text-gray-600 text-sm">
                Showcase your skills, ratings and achievements
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600 text-sm">
                Communicate directly with other users
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <img
                  className="h-8 w-8 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                  alt="User"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie"
                  alt="User"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor"
                  alt="User"
                />
              </div>
              <span className="ml-3 text-sm text-gray-600">
                Trusted by 500+ users in your community
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center space-x-4">
            <span className="text-sm">Fun Team</span>
            <span className="text-xs">★</span>
            <span className="text-sm">Fun Team</span>
            <span className="text-xs">★</span>
            <span className="text-sm">Fun Team</span>
            <span className="text-xs">★</span>
            <span className="text-sm">Fun Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
