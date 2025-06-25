"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/ProductType";
import { getRecentProducts } from "../api";
import Image from "next/image";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import Table, { Column } from "../components/commons/Table";

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getRecentProducts(10);
        const data = response;
        if (data.status === "success") {
          setProducts(data.data);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Define columns using the Column<Product> interface
  const columns: Column<Product>[] = [
    {
      key: "images",
      label: "Image",
      render: (value) => {
        if (Array.isArray(value)) {
          return (
            <Image
              src={value[0] || "/placeholder.png"} // Display the first image or a placeholder
              alt="Product"
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
            />
          );
        }
        return null;
      },
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "regular_price",
      label: "Price",
      render: (value) => {
        if (typeof value === "number") {
          return `$${value.toFixed(2)}`; // Format price as a string
        }
        return null;
      },
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        if (typeof value === "string") {
          return (
            <span
              className={`px-2 py-1 rounded text-sm ${
                value === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          );
        }
        return null;
      },
    },
    {
      key: "average_rating",
      label: "Average Rating",
      render: (value) => {
        if (typeof value === "number") {
          return `${value.toFixed(1)} / 5`; // Format rating with one decimal
        }
        return null;
      },
    },
  ];

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-medium mb-4 text-hub-primary-50">
        Product List
      </h2>
      <Table<Product>
        columns={columns}
        data={products}
        title="Recent Products"
        itemsPerPage={10}
        showPagination
      />
    </div>
  );
};

export default ProductTable;