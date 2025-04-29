"use client";

import React, { useEffect, useState, useCallback } from "react";
import AreaChart from "@/app/components/commons/AreaChart";
import { RecentReviews } from "./components/Review";
import { getStats } from "./api";
import StatsDashboardSkeleton from "./components/Skeletons/StatsDashboardSkeleton";
import OrderTable from "./orders/page";

interface GreetingsProps {
  userName: string; // Make userName required and provide a default in the parent component
}

const Greetings: React.FC<GreetingsProps> = ({ userName }) => {
  const getCurrentGreeting = useCallback((): string => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }, []);

  return (
    <div className="greeting">
      <h1 className="text-start text-2xl font-bold">
        {getCurrentGreeting()} {userName}!
      </h1>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="card p-6 w-full">
      <div className="text-sm font-medium text-white/60">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-4xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
};

interface Stats {
  total_customers: number;
  total_vendors: number;
  total_products: number;
  total_orders: number;
  total_revenue: string;
}

interface StatsDashboardProps {
  period: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ period }) => {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchStats = useCallback(async (selectedPeriod: string) => {
    try {
      const response = await getStats(selectedPeriod);
      if (response?.status === "success") {
        return response.data;
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchStats(period).then((data) => {
      setStats(data);
    });
  }, [fetchStats, period]);

  if (!stats) {
    return <StatsDashboardSkeleton />;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <StatCard
        title="Total Revenue"
        value={`$${Number(stats.total_revenue).toLocaleString()}`}
      />
      <StatCard title="Total Orders" value={stats.total_orders.toString()} />
      <StatCard
        title="Total Products"
        value={stats.total_products.toString()}
      />
      <StatCard title="Total Vendors" value={stats.total_vendors.toString()} />
      <StatCard
        title="Total Customers"
        value={stats.total_customers.toString()}
      />
    </div>
  );
};

const Home: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Greetings userName="David" />
        <div className="card p-1">
          <select defaultValue={selectedPeriod} onChange={handlePeriodChange}>
            <option value="this_week">This week</option>
            <option value="last_week">Last week</option>
            <option value="last_month">Last month</option>
            <option value="last_year">Last year</option>
          </select>
        </div>
      </div>
      <StatsDashboard period={selectedPeriod} />

      <div className="flex justify-between gap-4">
        <div className="w-[70%] card">
          <AreaChart />
        </div>
        <div className="w-[30%] card">
          <div className="p-6 rounded-xl ">
            <div className="flex items-center justify-between mb-6">
              <RecentReviews />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <OrderTable />
    </div>
  );
};

export default Home;
