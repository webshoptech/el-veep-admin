"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { getRecentOrders } from "../api";
import User from "@/types/UserType";
import type { Product } from "@/types/ProductType";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import StatusBadge from "@/utils/StatusBadge";
import Avatar from "@/utils/Avatar";
import TanStackTable from "../components/commons/TanStackTable";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import OrderType from "@/types/OrderType";

interface OrderTableProps {
  limit: number;
}

const OrderTable: React.FC<OrderTableProps> = ({ limit }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [totalOrders, setTotalOrders] = useState(0);

  const columns: ColumnDef<OrderType>[] = useMemo(() => [
    {
      header: "Customer",
      accessorKey: "user",
      cell: ({ getValue }) => {
        const value = getValue() as User | null;
        if (value && typeof value === "object") {
          return (
            <div className="flex items-center space-x-2">
              <Avatar
                src={value.profile_photo}
                alt={value.last_name || "User"}
              />
              <span>{value.last_name ?? "N/A"}</span>
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
      header: "Product",
      accessorKey: "product",
      cell: ({ getValue }) => {
        const value = getValue() as Product | null;
        if (value && typeof value === "object") {
          return (
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
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const numericValue = parseFloat(value);
        return isNaN(numericValue)
          ? "Invalid"
          : `$${numericValue.toFixed(2)}`;
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Shipping Status",
      accessorKey: "order",
      cell: ({ row }) => {
        const data = row.original;
        return <StatusBadge status={data.shipping_status} type="shipping" />;
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return formatHumanReadableDate(value);
      },
    },
  ], []);


  const fetchOrders = async (pageIndex: number, search: string) => {
    try {
      setLoading(true);
      const offset = limit;
      const response = await getRecentOrders(pagination.pageSize, offset, search);
      console.log(response.orders);
      setOrders(response.orders);
      setTotalOrders(response.total || 0); 
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to reduce unnecessary API calls
  const debouncedFetchOrders = useMemo(
    () => debounce((pageIndex: number, search: string) => {
      fetchOrders(pageIndex, search);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchOrders(pagination.pageIndex, search);

    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [pagination.pageIndex, debouncedFetchOrders, search]);
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page on search
  };
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <TanStackTable
        data={orders}
        columns={columns}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalRows: totalOrders,
        }}
        onPaginationChange={(updatedPagination) => {
          setPagination({
            pageIndex: updatedPagination.pageIndex,
            pageSize: updatedPagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default OrderTable;