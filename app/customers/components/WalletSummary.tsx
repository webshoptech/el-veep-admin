import {
  ArrowLeftCircleIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";

interface WalletSummaryProps {
  loading: boolean;
  totalSpent: number | string;
  totalRefunded: number | string;
  totalPending: number | string;
}

export default function WalletSummary({
  loading,
  totalSpent,
  totalRefunded,
  totalPending,
}: WalletSummaryProps) {
  const router = useRouter();

  const summaries = [
    {
      label: "Total Spent",
      value: totalSpent,
      icon: <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Total Refunded",
      value: totalRefunded,
      icon: <ArrowPathIcon className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Pending Amount",
      value: totalPending,
      icon: <ClockIcon className="w-6 h-6 text-green-600" />,
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaries.map(({ label, value, icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? <Skeleton width={80} /> : `$${value}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
