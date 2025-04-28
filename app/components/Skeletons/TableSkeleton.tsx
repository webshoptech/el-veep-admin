import React from "react";

const TableSkeleton: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-4">  </h2>
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 py-3 px-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-gray-300 rounded col-span-1"></div>
            <div className="h-4 bg-gray-300 rounded col-span-2"></div>
            <div className="h-4 bg-gray-300 rounded col-span-1"></div>
            <div className="h-4 bg-gray-300 rounded col-span-1"></div>
            <div className="h-4 bg-gray-300 rounded col-span-1"></div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="py-3 px-4 flex items-center space-x-4 animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
              {/* Title */}
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              {/* Price */}
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
              {/* Quantity */}
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
              {/* Status */}
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;