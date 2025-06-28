import Skeleton from "react-loading-skeleton";

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
        { label: "Total Spent", value: totalSpent },
        { label: "Total Refunded", value: totalRefunded },
    ];

    return (
        <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Wallet Balance</h2>
            <div className="grid grid-cols-2 gap-6">

                {summaries.map(({ label, value }) => (
                    <div key={label} className="card p-4 bg-gray-100 rounded">
                        <p className="text-sm text-gray-200 font-bold">{label}</p>
                        <p className="text-3xl font-bold text-white">
                            {loading ? <Skeleton width={80} /> : `$${value}`}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
