import {
    CubeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import { Stats } from "@/types/ProductType";

interface ItemSummaryProps {
    loading: boolean;
    stats: Stats;
}

export default function ItemSummary({ loading, stats }: ItemSummaryProps) {
    const summaries = [
        {
            label: "Total Items",
            value: stats.total_items,
            icon: <CubeIcon className="w-6 h-6 text-blue-600" />,
        },
        {
            label: "Active Items",
            value: stats.total_active,
            icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
        },
        {
            label: "Inactive Items",
            value: stats.total_inactive,
            icon: <XCircleIcon className="w-6 h-6 text-yellow-600" />,
        },
        {
            label: "Out of Stock Items",
            value: stats.total_out_of_stock,
            icon: <ShoppingBagIcon className="w-6 h-6 text-red-600" />,
        },
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {summaries.map(({ label, value, icon }) => (
                    <div
                        key={label}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
                    >
                        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {loading ? <Skeleton width={40} /> : value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
