"use client";

import React, { useEffect, useState } from "react";
import AreaChart from "@/app/components/commons/AreaChart";
import { RecentReviews } from "./components/Review";
import { getStats } from "./api";
import StatsDashboardSkeleton from "./components/Skeletons/StatsDashboardSkeleton";
import { Greetings } from "@/utils/Greetings";
import OrdersTable from "./orders/components/OrdersTable";

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="card w-full p-6">
    <div className="text-sm font-medium text-white/60">{title}</div>
    <div className="mt-2 flex items-baseline gap-2">
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  </div>
);

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getStats(period);
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    if (period) {
      fetchStats();
    }
  }, [period]);

  if (isLoading) {
    return <StatsDashboardSkeleton />;
  }

  // Render an error message if the fetch failed.
  if (error) {
    return <div className="card p-6 text-red-400">{error}</div>
  }

  // Render nothing or a 'no data' message if stats are not available.
  if (!stats) {
    return null;
  }

  // To avoid repetition, we can map over an array of stat details.
  const statCards = [
    { title: "Total Revenue", value: `$${Number(stats.total_revenue).toLocaleString()}` },
    { title: "Total Orders", value: stats.total_orders },
    { title: "Total Customers", value: stats.total_customers },
    { title: "Total Vendors", value: stats.total_vendors },
    { title: "Total Products", value: stats.total_products },
  ];

  return (
    <div className="flex items-center justify-between gap-4">
      {statCards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} />
      ))}
    </div>
  );
};

const Home: React.FC = () => {
   const [selectedPeriod, setSelectedPeriod] = useState("this_week");

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center justify-between">
        <Greetings userName="David" />
        <div className="card p-1 text-white">
          <select value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="this_week">This week</option>
            <option value="last_week">Last week</option>
            <option value="last_month">Last month</option>
            <option value="last_year">Last year</option>
          </select>
        </div>
      </div>

      <StatsDashboard period={selectedPeriod} />

      <div className="flex justify-between gap-4">
        <div className="card w-[70%]">
          <AreaChart />
        </div>
        <div className="card w-[30%] p-6">
          <RecentReviews />
        </div>
      </div>

      <OrdersTable limit={10} />
    </div>
  );
};

export default Home;