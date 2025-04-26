import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getSalesGraph } from "@/app/api";
import AreaChartSkeleton from "../Skeletons/AreaChartSkeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function AreaChart() {
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: number[];
  }>({
    categories: [],
    series: [],
  });
  const [period, setPeriod] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChartData = useCallback(async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const response = await getSalesGraph(selectedPeriod);
      if (
        response?.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        const categories = response.data.data.map(
          (item: { day: string }) => item.day
        );
        const series = response.data.data.map((item: { total: string }) =>
          parseFloat(item.total)
        );
        setChartData({ categories, series });
      } else {
        console.warn("No data available for the selected period.");
        setChartData({ categories: [], series: [] });
      }
    } catch (error) {
      console.error("Failed to fetch sales graph data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData(period);
  }, [fetchChartData, period]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#F97316"], // Orange color
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
      colors: ["#F97316"],
    },
    series: [
      {
        name: "Sales",
        data: chartData.series,
      },
    ],
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#9CA3AF", // Gray text color
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
        },
        formatter: (value) => Math.round(value).toLocaleString(),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => value.toLocaleString(),
      },
      theme: "dark",
    },
    markers: {
      size: 4,
      colors: ["#F97316"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(event.target.value);
  };

  if (loading) {
    return <AreaChartSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Sales Graph</h2>
        <div className="card p-1">
          <select defaultValue="January" onChange={handlePeriodChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <ReactApexChart
          options={options}
          series={options.series}
          type="area"
          height={300}
        />
      </div>
    </div>
  );
}

export default AreaChart;