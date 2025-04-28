'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getRecentOrders } from "../api";
import { Order } from "@/types/Order";
import User from "@/types/User";
import { Product } from "@/types/Product";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import { formatHumanReadableDate } from "../components/commons/formatHumanReadableDate";
import Table from "../components/commons/Table";
import type { Column } from "../components/commons/Table";  

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = React.useMemo(() => [
    {
      label: "Customer",
      key: "user",
      render: (value: User | null) => (
        <div className="flex items-center space-x-2">
          {value?.profile_photo ? (
            <Image
              src={value.profile_photo}
              alt={value.last_name || "User"}
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              ?
            </div>
          )}
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
            src={value.images[0] ?? ''}
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
      render: (value: string | number) => `$${Number(value).toFixed(2)}`,
    },
    {
      label: "Quantity",
      key: "quantity",
    },
    {
      label: "Payment Status",
      key: "order",
      render: (_value: Order, row: Order) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            row.order.payment_status === "paid"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.order.payment_status.charAt(0).toUpperCase() + row.order.payment_status.slice(1)}

        </span>
      ),
    },
    {
      label: "Shipping Status",
      key: "order",
      render: (_value: Order, row: Order) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            row.order.shipping_status === "delivered"
              ? "bg-green-100 text-green-600"
              : row.order.shipping_status === "ongoing"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
{row.order.shipping_status.charAt(0).toUpperCase() + row.order.shipping_status.slice(1)}
</span>
      ),
    },
    {
      label: "Created At",
      key: "created_at",
      render: (value: string) => formatHumanReadableDate(value),
    },
  ], []);

  useEffect(() => {
    async function fetchOrders() {
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
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {/* <h2 className="text-lg font-medium text-gray-800 mb-4">Order Details</h2> */}
      <Table
        data={orders}
        columns={columns}
        title="Recent Orders"
        itemsPerPage={10}
        showPagination={true}
      />
    </div>
  );
};

export default OrderTable;
