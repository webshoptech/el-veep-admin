import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";

interface WalletSummaryProps {
    loading: boolean;
    totalSpent: number | string;
    totalRefunded: number | string;
}

export default function WalletSummary({
    loading,
    totalSpent,
    totalRefunded,
}: WalletSummaryProps) {
    const summaries = [
        { label: "Total Revenue", value: totalSpent },
        { label: "Available Balance", value: totalRefunded },
    ];
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Wallet Balance</h2>
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-lg rounded-lg text-hub-secondary-500 hover:text-hub-secondary-600 transition cursor-pointer"
                >
                    <ArrowLeftCircleIcon className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
            <div className="grid grid-cols-2 gap-6">

                {summaries.map(({ label, value }) => (
                    <div key={label} className="card p-4 bg-gray-100 rounded">
                        <p className="text-sm text-gray-800 font-bold">{label}</p>
                        <p className="text-3xl font-bold text-black">
                            {loading ? <Skeleton width={80} /> : `$${value}`}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
