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
    <span className={`px-2 py-1 rounded text-sm ${getColorClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;