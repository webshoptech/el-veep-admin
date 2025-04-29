"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { getRecentOrders } from "../api";
import type { Order } from "@/types/Order";
import  User from "@/types/User";
import type { Product } from "@/types/Product";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import { formatHumanReadableDate } from "../components/commons/formatHumanReadableDate";
import Table, { Column } from "../components/commons/Table";

// Avatar Component
const Avatar: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => (
  src ? (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 object-cover rounded-full"
    />
  ) : (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
      ?
    </div>
  )
);

// Status Tag Component
const StatusTag: React.FC<{ status: string; type: "payment" | "shipping" }> = ({ status, type }) => {
  const colors =
    type === "payment"
      ? status === "paid"
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"
      : status === "delivered"
      ? "bg-green-100 text-green-600"
      : status === "ongoing"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  return (
    <span className={`px-2 py-1 rounded text-sm ${colors}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define Columns
  const columns: Column[] = useMemo(
    () => [
      {
        label: "Customer",
        key: "user",
        render: (value: User) => (
          <div className="flex items-center space-x-2">
            <Avatar src={value?.profile_photo} alt={value?.last_name || "User"} />
            <span>{value?.last_name ?? "Unknown User"}</span>
          </div>
        ),
      },
      {
        label: "Product",
        key: "product",
        render: (value: Product) => (
          <div className="flex items-center space-x-2">
            <Image
              src={value.images[0] ?? ""}
              alt={value.title}
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded"
            />
            <span>{value.title}</span>
          </div>
        ),
      },
      {
        label: "Subtotal",
        key: "subtotal",
        render: (value: string | number) => {
          const numericValue = Number(value);
          return isNaN(numericValue) ? "Invalid" : `$${numericValue.toFixed(2)}`;
        },
      },
      { label: "Quantity", key: "quantity" },
      {
        label: "Payment Status",
        key: "order.payment_status",
        render: (_value: string, row: Order) => (
          <StatusTag status={row.order.payment_status} type="payment" />
        ),
      },
      {
        label: "Shipping Status",
        key: "order.shipping_status",
        render: (_value: string, row: Order) => (
          <StatusTag status={row.order.shipping_status} type="shipping" />
        ),
      },
      {
        label: "Created At",
        key: "created_at",
        render: (value: string) => formatHumanReadableDate(value),
      },
    ],
    []
  );

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getRecentOrders();
        if (response.status === "success") {
          setOrders(response.data);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Render States
  if (loading) return <TableSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Table
      data={orders}
      columns={columns}
      title="Recent Orders"
      itemsPerPage={10}
      showPagination
    />
  );
};

export default OrderTable;