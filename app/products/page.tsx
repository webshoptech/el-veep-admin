"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/Product";

import { getRecentProducts } from "../api";
import Image from "next/image";
import TableSkeleton from "../components/Skeletons/TableSkeleton";
import Table from "../components/commons/Table";

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getRecentProducts();
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

  const columns = [
    {
      header: "Image",
      accessor: "images",
      render: (value: unknown) => {
        const images = value as string[]; // Safely cast value to string[]
        return (
          <Image
            src={images[0] || ""} // Display the first image in the array
            alt="Product"
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded"
          />
        );
      },
    },
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Price",
      accessor: "regular_price",
      render: (value: unknown) => `$${value as string}`, // Format price with $
    },
    {
      header: "Quantity",
      accessor: "quantity",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: unknown) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value === "active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {value as string}
        </span>
      ),
    },
    {
      header: "Average Rating",
      accessor: "average_rating",
      render: (value: unknown) => `${(value as number).toFixed(1)} / 5`, // Format rating
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
      <Table
        columns={columns}
        data={products.map((product) => ({ ...product }))}
      />
    </div>
  );
};

export default ProductTable;
