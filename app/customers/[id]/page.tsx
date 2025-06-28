"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserDetail } from "@/app/api_/users";
import { UserDetailResponse } from "@/types/UserType";
import Image from "next/image";

export default function UserDetail() {
    const { id } = useParams();
    const type = "customer";

    const [user, setUser] = useState<UserDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await getUserDetail(id.toString(), type);
                setUser(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load user details.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, type]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!user) return null;

    return (
        <div className="p-0 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Wallet Summary</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="card p-4 bg-gray-100 rounded">
                    <p className="text-sm text-gray-100">Total Spent</p>
                    <p className="text-xl font-semibold text-gray-200">
                        ${user.wallet.total_earning}
                    </p>
                </div>
                <div className="card p-4 bg-gray-100 rounded">
                    <p className="text-sm text-gray-100">Total Refunded</p>
                    <p className="text-xl font-semibold text-gray-200">
                        ${user.wallet.available_to_withdraw}
                    </p>
                </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Profile</h2>

            {/* User Profile Info */}
            <div className="card p-6">
                <div className="flex items-center gap-4">
                    <Image
                        width={80}
                        height={80}
                        src={user.profile_photo}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-100">
                            {user.name} {user.last_name}
                        </h3>
                        <p className="text-sm text-gray-200">{user?.email}</p>
                        <p className="text-sm text-gray-200">{user?.phone}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-200">
                    <div>
                        <span className="font-bold">Shipping address:</span>{" "}
                        {user.address
                            ? [user.address.city, user.address.state, user.address.country]
                                .filter(Boolean)
                                .join(", ") || "Not provided"
                            : "Not provided"}
                    </div>
                    <div>
                        <span className="font-medium">Account Status:</span>{" "}
                        <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${user.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Email Verification */}
                    <div>
                        <span className="font-medium">Account Email:</span>{" "}
                        <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${user.email_verified_at
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {user.email_verified_at ? "Verified" : "Unverified"}
                        </span>
                    </div>
                    <div>
                        <span className="font-bold">Location:</span>{" "}
                        {[user?.city, user?.state, user?.country]
                            .filter(Boolean)
                            .join(", ") || "Not provided"}
                    </div>

                </div>
            </div>

            {/* <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Order Items</h2>

            {user.cart_items && user.cart_items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {user.cart_items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item.product?.title ?? "Unnamed Product"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Quantity: <strong>{item.quantity}</strong>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Unit Price: ${parseFloat(item.price).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right text-xs text-gray-400">
                                    <p>Added: {new Date(item.created_at).toLocaleDateString()}</p>
                                    <p>Updated: {new Date(item.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-1 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Order Status:</span>{" "}
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize text-xs">
                                        {item.order?.shipping_status || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Payment Method:</span>{" "}
                                    {item.order?.payment_method ?? "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Payment Status:</span>{" "}
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${item.order?.payment_status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {item.order?.payment_status ?? "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Vendor Payout:</span>{" "}
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${item.order?.vendor_payment_settlement_status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {item.order?.vendor_payment_settlement_status ?? "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )} */}

        </div>
    );

}
