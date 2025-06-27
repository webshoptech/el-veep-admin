"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Product } from "@/types/ProductType";
import { getRecentProducts } from "@/app/api";
import TanStackTable from "@/app/components/commons/TanStackTable";

interface ProductTableProps {
  limit: number;
}

const ProductsTable: React.FC<ProductTableProps> = ({ limit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [totalProducts, setTotalProducts] = useState(0);

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        header: "Product",
        accessorKey: "title",
        cell: ({ row }) => {
          const image = row.original.images?.[0];
          return (
            <div className="flex items-center space-x-2">
              <Image
                src={image || "/placeholder.png"}
                alt={row.original.title}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{row.original.title}</span>
            </div>
          );
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        header: "Price",
        accessorKey: "sales_price",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          const numericValue = parseFloat(value);
          return isNaN(numericValue)
            ? "N/A"
            : `$${numericValue.toFixed(2)}`;
        },
      },
      {
        header: "Stock",
        accessorKey: "quantity",
      },
      {
        header: "Vendor",
        accessorKey: "vendor.name",
        cell: ({ row }) => row.original.vendor?.name ?? "N/A",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return formatHumanReadableDate(value);
        },
      },
      {
        header: "Action",
        accessorKey: "id",
        cell: ({ getValue }) => {
          const productId = getValue();
          return (
            <button
              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
              onClick={() => {
                window.location.href = `/products/${productId}`;
              }}
            >
              View product
            </button>
          );
        },
      },
    ],
    []
  );


  const fetchProducts = async (pageIndex: number, search: string) => {
    try {
      setLoading(true);
      const offset = pageIndex * pagination.pageSize;
      const response = await getRecentProducts(
        pagination.pageSize,
        offset,
        search
      );
      setProducts(response.data);
      setTotalProducts(response.total || 0);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = useMemo(
    () =>
      debounce((pageIndex: number, search: string) => {
        fetchProducts(pageIndex, search);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchProducts(pagination.pageIndex, search);
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [pagination.pageIndex, debouncedFetchProducts, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product or vendor name..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
        />
      </div>
      <TanStackTable
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalRows: totalProducts,
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

export default ProductsTable;
