"use client";

import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import clsx from "clsx";
import { UserDetailResponse } from "@/types/UserType";
import { changeUserStatus } from "@/app/api_/users";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";

interface ProfileCardProps {
    user: UserDetailResponse | null;
    loading: boolean;
}

export default function ProfileCard({ user, loading }: ProfileCardProps) {
    const [selectedStatus, setSelectedStatus] = useState<{
        label: string;
        value: string;
    }>(
        user?.is_active
            ? { label: "Active", value: "true" }
            : { label: "Inactive", value: "false" }
    );

    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (option: { label: string; value: string }) => {
        if (!user?.id) return;

        setSelectedStatus(option);
        setUpdating(true);

        try {
            const isActiveBoolean = option.value === "true";
            await changeUserStatus(user.id.toString(), isActiveBoolean);
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Failed to update user status", error);
        } finally {
            setUpdating(false);
        }
    };


    const statusOptions = [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
    ];

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            {/* Banner Background */}
            <div className="relative h-24 bg-gradient-to-r from-orange-400 to-yellow-400" />

            {/* Profile Section */}
            <div className="relative -mt-10 px-6 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Avatar */}
                    {loading ? (
                        <Skeleton circle width={80} height={80} />
                    ) : (
                        <div className="w-20 h-20 relative border-4 border-white rounded-full overflow-hidden shadow-md">
                            <Image
                                fill
                                src={user?.profile_photo ?? "/placeholder.jpg"}
                                alt={user?.name ?? "User"}
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* User Details */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">
                            {loading ? <Skeleton width={120} /> : `${user?.name} ${user?.last_name}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {loading ? <Skeleton width={160} /> : user?.email}
                        </p>

                        <div className="flex gap-2 mt-2 items-center">
                            {loading ? (
                                <Skeleton width={100} height={30} />
                            ) : (
                                <div className="w-40">
                                    <SelectDropdown
                                        options={statusOptions}
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        disabled={updating}
                                    />
                                </div>
                            )}

                            {loading ? (
                                <Skeleton width={80} />
                            ) : (
                                <span
                                    className={clsx(
                                        "px-2 py-0.5 text-xs rounded-full font-semibold",
                                        user?.email_verified_at
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                    )}
                                >
                                    {user?.email_verified_at ? "Email Verified" : "Email Unverified"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Info & Address */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
                            Personal Info
                        </p>
                        <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {loading ? <Skeleton width={100} /> : user?.phone ?? "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Member Since:</span>{" "}
                            {loading ? (
                                <Skeleton width={120} />
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
                    </div>

                    <div>
                        <p className="text-gray-400 font-semibold uppercase text-xs mb-1">
                            Shipping Address
                        </p>
                        {loading ? (
                            <Skeleton width={180} />
                        ) : user?.address ? (
                            <p className="text-gray-700">
                                {[user.address.street_address, user.address.city, user.address.state, user.address.country]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        ) : (
                            <p className="text-gray-500">Not provided</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
