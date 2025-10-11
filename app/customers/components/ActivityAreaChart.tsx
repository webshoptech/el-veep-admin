"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { formatDate } from "@/utils/formatHumanReadableDate";
import { MONTHS } from "@/app/setting";
import AreaChartSkeleton from "@/app/components/Skeletons/AreaChartSkeleton";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { getActivityGraph } from "@/app/api_/users";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaChartProps {
    type: string;
}

const AreaChart = ({ type }: AreaChartProps) => {
    const [chartData, setChartData] = useState<{ categories: string[]; series: number[] }>({
        categories: [],
        series: [],
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [hasData, setHasData] = useState<boolean>(false);

    const monthOptions = MONTHS.map((m) => ({ label: m, value: m }));
    const [selected, setSelected] = useState<{ label: string; value: string }>(monthOptions[0]
    );

    const fetchChartData = useCallback(async (selectedPeriod: string) => {
        setLoading(true);
        try {
            const response = await getActivityGraph(selectedPeriod, type);
            const raw = response.data ?? [];
            if (response?.status === "success" && Array.isArray(raw) && raw.length > 0) {
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
    }, [type]);

    useEffect(() => {
        fetchChartData(selected.value);
    }, [fetchChartData, selected]);

    const options: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "area",
                height: 350,
                toolbar: { show: false },
                background: "transparent",
                zoom: { enabled: true },
            },
            grid: {
                show: true,
                 gradientToColors: ["rgba(0, 176, 94, 0.15)"],
                strokeDashArray: 4,
                padding: {
                    top: 10,
                    bottom: 0,
                    left: 10,
                    right: 10,
                },
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: "smooth",
                width: 1.5,
                colors: ["#00B05E"],
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "vertical",
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 0.4,
                    opacityTo: 0.05,
                    stops: [0, 90, 100],
                    colorStops: [
                        {
                            offset: 0,
                            color: "rgba(0, 176, 94, 0.4)",
                            opacity: 0.4,
                        },
                        {
                            offset: 100,
                            color: "rgba(0, 176, 94, 0.05)",
                            opacity: 0.05,
                        },
                    ],
                },
                colors: ["#00B05E"],

            },
            series: [{ name: "Activity", data: chartData.series }],
            xaxis: {
                categories: chartData.categories,
                labels: {
                    style: { colors: "#a1a1aa" },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    style: { colors: "#a1a1aa" },
                    formatter: (val) => Math.round(val).toLocaleString(),
                },
            },
            tooltip: {
                theme: "dark",
                y: {
                    formatter: (val) => val.toLocaleString(),
                },
            },
            markers: {
                size: 4,
                colors: ["#00B05E"],
                strokeColors: "#ffffff",
                strokeWidth: 2,
                hover: { size: 6 },
            },
        }),
        [chartData]
    );
    return (
        <div className="p-6 card text-gray-950">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Activities Graph</h2>
                <SelectDropdown options={monthOptions} value={selected} onChange={setSelected} />
            </div>

            {loading ? (
                <AreaChartSkeleton />
            ) : hasData ? (
                <ReactApexChart options={options} series={options.series} type="area" height={300} />
            ) : (
                <div className="text-center text-black py-10">
                    No data available for {selected.label}.
                </div>
            )}
        </div>
    );
};

export default AreaChart;
