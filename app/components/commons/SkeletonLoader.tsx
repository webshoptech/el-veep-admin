// components/SkeletonLoader.tsx
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SkeletonLoader() {
  return (
    <div className="p-6 bg-white h-screen rounded-xl w-full shadow animate-pulse">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
        <div className="flex gap-4">
          <div className="h-5 w-5 bg-gray-300 rounded-full" />
          <div className="h-5 w-5 bg-gray-300 rounded-full" />
          <div className="h-5 w-5 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Reporter Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div className="w-40 h-4 bg-gray-300 rounded-md" />
        </div>
        <div className="ml-8 w-3/4 h-5 bg-gray-300 rounded-md" />
        <div className="ml-8 w-32 h-3 bg-gray-200 rounded-md" />
      </div>

      <div className="border-b mb-4" />

      {/* Chat Bubbles */}
      <div className="space-y-6 mb-8">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-start gap-3 max-w-[80%]">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="p-4 bg-gray-200 rounded-xl w-full max-w-sm space-y-2">
              <div className="h-3 w-24 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-3 w-20 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-full bg-gray-200 rounded-full" />
          <div className="h-5 w-5 bg-gray-300 rounded" />
          <div className="h-8 w-20 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
