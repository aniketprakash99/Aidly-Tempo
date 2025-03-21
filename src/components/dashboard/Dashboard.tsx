import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import CoinBalanceCard from "./CoinBalanceCard";
import RequestBoard from "./RequestBoard";
import RecommendationsSection from "./RecommendationsSection";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.user_metadata.username || "User"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <CoinBalanceCard />
            <RecommendationsSection />
          </div>
        </div>

        <div className="md:col-span-3">
          <RequestBoard />
        </div>
      </div>
    </div>
  );
}
