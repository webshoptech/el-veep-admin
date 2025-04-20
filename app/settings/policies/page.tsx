"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HomeIcon } from "@heroicons/react/20/solid";

const PolicyEditor = dynamic(
  () => import("@/app/settings/policies/components/PolicyEditor"),
  {
    ssr: false,
  }
);

// Define policies and types
const pages = [
  { name: "Privacy Policy", type: "privacy" },
  { name: "Terms and Conditions", type: "terms" },
  { name: "Delivery Policy", type: "delivery" },
  { name: "Refund Policy", type: "refund" },
  { name: "Return Policy", type: "return" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <div className="p-0">
      <nav className="mb-4">
        <div className="flex items-center space-x-2">
          <HomeIcon className="w-5 h-5 text-hub-secondary-500" />
          <span className="text-hub-secondary-600 text-sm">Settings</span>
        </div>
        <div className="mt-4 flex space-x-4 border-b">
          {pages.map((page) => (
            <button
              key={page.name}
              onClick={() => setActiveTab(page.type)}
              className={`pb-2 px-3 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === page.type
                  ? "border-hub-primary-500 text-hub-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="bg-white rounded-xl shadow-md p-4">
        <PolicyEditor type={activeTab} />
      </div>
    </div>
  );
}
