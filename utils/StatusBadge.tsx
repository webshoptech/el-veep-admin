import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface StatusBadgeProps {
    status: string;
    type?: "payment" | "shipping";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
    const getColorClasses = () => {
        if (type === "payment") {
            return status === "paid"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600";
        }

        switch (status) {
            case "delivered": return "bg-green-100 text-green-600";
            case "ongoing": return "bg-yellow-100 text-yellow-600";
            default: return "bg-red-100 text-red-600";
        }
    };

    return (
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${getColorClasses()}`}>
            {type === "payment" && status === "paid" && <CheckCircleIcon className="w-4 h-4" />}
            {type === "payment" && status !== "paid" && <XCircleIcon className="w-4 h-4" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

    );
};

export default StatusBadge;