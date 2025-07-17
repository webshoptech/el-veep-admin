import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { UserDetailResponse } from "@/types/UserType";
import clsx from "clsx";

interface ProfileCardProps {
    user: UserDetailResponse | null;
    loading: boolean;
}

export default function ProfileCard({ user, loading }: ProfileCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-start gap-6">
            {/* Profile Section */}
            <div className="flex-shrink-0 flex flex-col items-center text-center">
                {loading ? (
                    <Skeleton circle width={80} height={80} />
                ) : (
                    <div className="relative w-20 h-20 rounded-full border-4 border-orange-500 overflow-hidden">
                        <Image
                            fill
                            src={user?.profile_photo ?? "/placeholder.jpg"}
                            alt={user?.name ?? "User"}
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {loading ? <Skeleton width={100} /> : `${user?.name} ${user?.last_name}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {loading ? <Skeleton width={140} /> : user?.email}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-auto w-px bg-gray-200" />

            {/* Personal Info */}
            <div className="flex-1 space-y-1 text-sm">
                <p className="text-gray-400 font-semibold uppercase">Personal Information</p>
                <p className="text-gray-500">
                    <span className="font-medium text-gray-700">Phone no: </span>
                    {loading ? <Skeleton width={120} /> : user?.phone || "N/A"}
                </p>
                <p className="text-gray-500">
                    <span className="font-medium text-gray-700">Member Since: </span>
                    {loading ? (
                        <Skeleton width={100} />
                    ) : user?.created_at ? (
                        new Date(user.created_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })
                    ) : (
                        "N/A"
                    )}
                </p>
                <p className="text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Account Status: </span>
                    {loading ? (
                        <Skeleton width={80} />
                    ) : (
                        <span
                            className={clsx(
                                "ml-1 px-1.5 py-0.5 font-bold rounded text-xs",
                                user?.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}
                        >
                            {user?.is_active ? "Active" : "Inactive"}
                        </span>
                    )}
                </p>

                <p className="text-gray-500">
                    <span className="font-medium text-gray-700">Account Email: </span>
                    {loading ? (
                        <Skeleton width={80} />
                    ) : (
                        <span
                            className={clsx(
                                "ml-1 px-1.5 py-0.5 font-bold rounded text-xs",
                                user?.email_verified_at ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                            )}
                        >
                            {user?.email_verified_at ? "Verified" : "Unverified"}
                        </span>
                    )}
                </p>

            </div>

            {/* Divider */}
            <div className="hidden md:block h-auto w-px bg-gray-200" />

            {/* Shipping & Orders */}
            <div className="flex-1 space-y-3 text-sm">
                <div>
                    <p className="text-gray-400 font-semibold uppercase">Shipping Address</p>
                    <p className="text-gray-700">
                        {loading ? (
                            <Skeleton width={200} />
                        ) : user?.address ? (
                            [user.address.city, user.address.state, user.address.country]
                                .filter(Boolean)
                                .join(", ")
                        ) : (
                            "Not provided"
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-gray-400 font-semibold uppercase">Order History</p>
                    <div className="flex gap-6 text-start mt-2">
                        {["Total Spent", "Total Refunded", "Canceled Orders"].map((label, idx) => (
                            <div key={label}>
                                <p className="text-xl font-bold text-gray-900">
                                    {loading ? <Skeleton width={30} /> : getOrderCount(user, idx)}
                                </p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to map order counts
function getOrderCount(user: UserDetailResponse | null, index: number) {
    if (!user?.wallet.available_to_withdraw) return 0;
    switch (index) {
        case 0:
            return user.wallet.pending ?? 0;
        case 1:
            return user.wallet.total_earning ?? 0;
        default:
            return 0;
    }
}
