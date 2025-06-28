"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getSalesGraph } from "@/app/api";
import AreaChartSkeleton from "../Skeletons/AreaChartSkeleton";
import { formatDate } from "@/utils/formatHumanReadableDate";
import { MONTHS } from "@/app/setting";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
function AreaChart() {
    const [chartData, setChartData] = useState<{ categories: string[]; series: number[] }>({
        categories: [],
        series: [],
    });

    const [period, setPeriod] = useState<string>(new Date().toLocaleString("default", { month: "long" }));
    const [loading, setLoading] = useState<boolean>(true);
    const [hasData, setHasData] = useState<boolean>(false);

    const fetchChartData = useCallback(async (selectedPeriod: string) => {
        setLoading(true);
        try {
            const response = await getSalesGraph(selectedPeriod);
            const raw = response?.data?.data ?? [];

            if (response?.data?.status === "success" && Array.isArray(raw) && raw.length > 0) {
                const categories = raw.map((item: { day: string }) => formatDate(new Date(item.day)));
                const series = raw.map((item: { total: string }) => parseFloat(item.total));
                setChartData({ categories, series });
                setHasData(true);
            } else {
                setChartData({ categories: [], series: [] });
                setHasData(false);
            }
        } catch (error) {
            console.error("Failed to fetch sales graph data:", error);
            setHasData(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChartData(period);
    }, [fetchChartData, period]);

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            background: "transparent",
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: ["#F97316"],
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
            colors: ["#FFF"],
        },
        series: [{ name: "Sales", data: chartData.series }],
        xaxis: {
            categories: chartData.categories,
            labels: { style: { colors: "#FFF" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#FFF" },
                formatter: (val) => Math.round(val).toLocaleString(),
            },
        },
        tooltip: {
            y: { formatter: (val) => val.toLocaleString() },
            theme: "dark",
        },
        markers: {
            size: 4,
            colors: ["#F97316"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: { size: 6 },
        },
    }), [chartData]);

    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriod(event.target.value);
    };

    return (
        <div className="p-6 text-white">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Sales Graph</h2>
                <div className="card p-1">
                    <select value={period} onChange={handlePeriodChange}>
                        {MONTHS.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <AreaChartSkeleton />
            ) : hasData ? (
                <ReactApexChart
                    options={options}
                    series={options.series}
                    type="area"
                    height={300}
                />
            ) : (
                <div className="text-center text-white/70 py-10">No data available for {period}.</div>
            )}
        </div>
    );
}

export default AreaChart;
