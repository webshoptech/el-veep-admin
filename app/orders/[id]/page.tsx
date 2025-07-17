"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderDetail } from "@/app/api_/orders";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { CheckCircleIcon, MapPinIcon, UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { OrderItem } from "@/types/OrderType";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function OrderDetail() {
    const params = useParams();
    const orderId = params?.id as string | undefined;
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const response = await getOrderDetail(orderId);
                setOrder(response.data.order_item);
            } catch (err) {
                console.error("Failed to load order detail", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading || !order) return <Skeleton count={10} />;

    const { product, quantity, price, subtotal, order: orderMeta } = order;
    const { shop } = product;
    const customer = orderMeta.customer;


    return (
        <div className="bg-white p-6 rounded-xl shadow-md text-gray-600 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Order Details - #{orderMeta.id}
                </h1>
                <div className="flex items-center gap-2">
                    {orderMeta.shipping_status === "pending" && orderMeta.payment_status === "pending" && (
                        <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md text-sm font-medium">
                            Cancel Order
                        </button>
                    )}
                    <button className="bg-yellow-500 text-white px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1"><ArrowDownTrayIcon className="w-4 h-4" /> Download</button>
                </div>
            </div>

            {/* Customer + Order Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Customer Info</h2>
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span>{customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span>{customer.email}</span> {/* mock email */}
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{customer.phone}</span> {/* mock phone */}
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="border rounded-lg p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Shipping Info</h2>
                    <p className="flex items-center gap-2 text-sm">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span>Address ID #{orderMeta.address_id}</span>
                    </p>
                    <p className="text-xs text-gray-400">Shipping Method: {orderMeta.shipping_method}</p>
                    <p className="text-xs text-gray-400">Status: {orderMeta.shipping_status}</p>
                </div>

                {/* Payment Info */}
                <div className="border rounded-lg p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Payment Info</h2>
                    <p className="text-sm">Status: <span className="text-green-600 font-medium">{orderMeta.payment_status}</span></p>
                    <p className="text-xs text-gray-400">Method: {orderMeta.payment_method}</p>
                    <p className="text-xs text-gray-400">Reference: {orderMeta.payment_reference}</p>
                </div>
            </div>

            {/* Shop Info */}
            <div className="flex items-center gap-4 border p-4 rounded-lg">
                <Image
                    src={shop.logo}
                    alt={shop.name}
                    width={64}
                    height={64}
                    className="rounded-full border object-cover w-16 h-16"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        {shop.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{shop.description}</p>
                </div>
            </div>

            {/* Order Items */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-2 text-left">S/N</th>
                            <th className="p-2 text-left">Products</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Discount</th>
                            <th className="p-2 text-left">Total</th>
                            <th className="p-2 text-left">Shipping Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t">
                            <td className="p-2">1</td>
                            <td className="p-2 flex items-center gap-2">
                                <Image
                                    src={product.images?.[0] || "/no-image.png"}
                                    width={40}
                                    height={40}
                                    alt={product.title}
                                    className="rounded-md object-cover"
                                />
                                <span>{product.title}</span>
                            </td>
                            <td className="p-2">{quantity}</td>
                            <td className="p-2">{parseFloat(price).toFixed(2)}CAD</td>
                            <td className="p-2">20.00CAD</td>
                            <td className="p-2">{parseFloat(subtotal).toFixed(2)}CAD</td>
                            <td className="p-2">
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-xs capitalize">
                                    {orderMeta.shipping_status ?? "N/A"}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="grid gap-1 text-sm text-right max-w-sm ml-auto">
                <p>
                    <span className="text-gray-500">Subtotal</span>{" "}
                    <span className="ml-4 text-gray-700 font-medium">100.00CAD</span>
                </p>
                <p>
                    <span className="text-gray-500">Shipping</span>{" "}
                    <span className="ml-4 text-gray-700 font-medium">
                        {parseFloat(orderMeta.shipping_fee).toFixed(2)}CAD
                    </span>
                </p>
                <p>
                    <span className="text-gray-500">Tax</span>{" "}
                    <span className="ml-4 text-gray-700 font-medium">15.15CAD</span>
                </p>
                <p className="text-lg font-semibold mt-2">
                    <span>Grand Total</span>{" "}
                    <span className="ml-6">
                        {parseFloat(orderMeta.total).toFixed(2)}CAD
                    </span>
                </p>
            </div>

            {/* Payment Status */}
            <div className="flex justify-end">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    <CheckCircleIcon className="w-5 h-5" /> Paid
                </span>
            </div>
        </div>
    );
}
