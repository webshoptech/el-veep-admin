"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Product, Stats } from "@/types/ProductType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentProducts } from "@/app/api_/products";
import StatusBadge from "@/utils/StatusBadge";
import ItemSummary from "./ItemSummary";
import { getStockBadgeClass } from "@/utils/StockBadge";
import { BuildingStorefrontIcon, EyeIcon, StarIcon } from "@heroicons/react/24/outline";

interface ProductTableProps {
    limit: number;
    type: string;
}

const ProductsTable: React.FC<ProductTableProps> = ({ limit, type }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemStats, setItemStats] = useState<Stats>({
        total_items: 0,
        total_active: 0,
        total_inactive: 0,
        total_service: 0,
        total_product: 0,
    });

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: "Product",
                accessorKey: "title",
                cell: ({ row }) => {
                    const image = row.original.images?.[0];
                    const title = row.original.title;
                    const category = row.original.category?.name;

                    return (
                        <div className="flex items-center space-x-2">
                            <Image
                                src={image || "/placeholder.png"}
                                alt={title}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{title}</span>
                                {category && (
                                    <span className="text-xs text-gray-500">{category}</span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Avg. Rating",
                accessorKey: "average_rating",
                cell: ({ getValue }) => {
                    const rating = parseFloat(getValue() as string) || 0;
                    const stars = Math.round(rating); // Round to nearest whole number

                    return (
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    className={`w-4 h-4 ${index < stars ? "text-yellow-500" : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
                        </div>
                    );
                },
            },
            {
                header: "Price",
                cell: ({ row }) => {
                    const salesPrice = parseFloat(row.original.sales_price || "0");
                    const regularPrice = parseFloat(row.original.regular_price || "0");

                    const formattedSales = `$${salesPrice.toFixed(2)}`;
                    const formattedRegular = `$${regularPrice.toFixed(2)}`;

                    return (
                        <div className="flex flex-col text-xs">
                            <span className="text-gray-800 font-semibold">{formattedSales}</span>
                            {salesPrice > 0 && regularPrice > 0 && salesPrice < regularPrice && (
                                <span className="text-gray-500 line-through text-xs">{formattedRegular}</span>
                            )}
                        </div>
                    );
                },
            },

            {
                header: "Stock",
                accessorKey: "quantity",
                cell: ({ getValue }) => {
                    const quantity = getValue() as number;
                    const max = 100; // Use actual max stock if available
                    const badgeClass = getStockBadgeClass(quantity, max);

                    return (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass}`}>
                            {quantity}
                        </span>
                    );
                },
            },

            {
                header: "Vendor",
                accessorKey: "vendor.name",
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    const type = row.original.type;

                    return vendor ? (
                        <div className="flex flex-col text-gray-700">
                            <div className="flex items-center gap-2">
                                <BuildingStorefrontIcon className="w-4 h-4 text-amber-600" />
                                <span>{vendor.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-0.5 ml-6">
                                {type === "services" ? "Service Provider" : "Product Seller"}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-400 italic">N/A</span>
                    );
                },
            },
            {
                header: "Views",
                accessorKey: "views",
                cell: ({ getValue }) => {
                    const views = getValue() as number;

                    return (
                        <div className="flex items-center gap-1 text-gray-700">
                            <EyeIcon className="w-4 h-4 text-amber-600" />
                            <span>{views}</span>
                        </div>
                    );
                },
            },


            {
                header: "Status",
                accessorKey: "status",
                cell: ({ getValue }) => {
                    const status = String(getValue() || "").toLowerCase();
                    return <StatusBadge status={status} />;
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

    const fetchProducts = useCallback(
        async (pageIndex: number, search: string = "") => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await getRecentProducts(
                    pagination.pageSize,
                    offset,
                    search,
                    type
                );
                setProducts(response.data);
                setTotalProducts(response.total || 0);
                setItemStats(response.stats);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching products.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, type]
    );

    const debouncedFetchProducts = useMemo(() => {
        return debounce((pageIndex: number, search: string) => {
            fetchProducts(pageIndex, search);
        }, 300);
    }, [fetchProducts]);

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
        <div className="space-y-4">
            <ItemSummary loading={loading} stats={itemStats} />

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
