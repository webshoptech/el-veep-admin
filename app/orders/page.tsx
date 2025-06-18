"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { getRecentOrders } from "../api";
import type { Order } from "@/types/Order";
import User from "@/types/User";
import type { Product } from "@/types/Product";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Table, { Column } from "../components/commons/Table";
import StatusBadge from "@/utils/StatusBadge";
import Avatar from "@/utils/Avatar";

interface OrderTableProps {
  limit: number;
}

const OrderTable: React.FC<OrderTableProps> = ({ limit }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns: Column<Order>[] = useMemo(
    () => [
      {
        label: "Customer",
        key: "user",
        render: (value) => {
          if (value && typeof value === "object") {
            const user = value as User;
            return (
              <div className="flex items-center space-x-2">
                <Avatar
                  src={user.profile_photo}
                  alt={user.last_name || "User"}
                />
                <span>{user.last_name ?? "N/A"}</span>
              </div>
            );
          }
          return (
            <div className="flex items-center space-x-2">
              <Avatar alt="Unknown User" />
              <span>N/A</span>
            </div>
          );
        },
      },
      {
        label: "Product",
        key: "product",
        render: (value) => {
          if (value && typeof value === "object") {
            const product = value as Product;
            return (
              <div className="flex items-center space-x-2">
                <Image
                  src={product.images[0] ?? ""}
                  alt={product.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded"
                />
                <span>{product.title}</span>
              </div>
            );
          }
          return (
            <div className="flex items-center space-x-2">
              <Avatar alt="Unknown Product" />
              <span>N/A</span>
            </div>
          );
        },
      },
      {
        label: "Subtotal",
        key: "subtotal",
        render: (value) => {
          const numericValue = parseFloat(value as string);
          return isNaN(numericValue)
            ? "Invalid"
            : `$${numericValue.toFixed(2)}`;
        },
      },
      { label: "Quantity", key: "quantity" },
      {
        label: "Shipping Status",
        key: "order",
        render: (_value, row) => (
          <StatusBadge
            status={row.order.shipping_status}
            type="shipping"
          />
        ),
      },
      {
        label: "Created At",
        key: "created_at",
        render: (value) =>
          typeof value === "string"
            ? formatHumanReadableDate(value)
            : null,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getRecentOrders(limit);
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

  return loading ? (
    <TableSkeleton />
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <Table<Order>
      data={orders}
      columns={columns}
      title="Recent Orders"
      itemsPerPage={10}
      showPagination
    />
  );

};

export default OrderTable;