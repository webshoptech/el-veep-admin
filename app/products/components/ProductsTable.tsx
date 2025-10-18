"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Product, Stats } from "@/types/ProductType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listProducts, updateItemStatus } from "@/app/api_/products";
import ItemSummary from "./ItemSummary";
import { getStockBadgeClass } from "@/utils/StockBadge";
import { EyeIcon, PencilIcon, StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import ProductAreaChart from "./ProductAreaChart";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";
import { formatAmount } from "@/utils/formatCurrency";

type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "Published", value: "active" },
    { label: "Draft", value: "inactive" },
];

interface ProductTableProps {
    limit: number;
    type: string;
    status: string;
    // optional props from parent
    products?: Product[];
    onEdit?: (product: Product) => void;
    onDeleteConfirm?: (productId: number) => void;
    loading?: boolean;
    total?: number;
}

export default function ProductsTable({
    limit,
    type,
    status,
    products: externalProducts,
    onEdit,
    onDeleteConfirm,
    loading: externalLoading,
    total: externalTotal,
}: ProductTableProps) {
    const [products, setProducts] = useState<Product[]>(externalProducts ?? []);
    const [loading, setLoading] = useState<boolean>(externalLoading ?? !externalProducts);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalProducts, setTotalProducts] = useState<number>(externalTotal ?? 0);
    const [itemStats, setItemStats] = useState<Stats>({
        total_items: 0,
        total_active: 0,
        total_inactive: 0,
        total_out_of_stock: 0,
    });

    useEffect(() => {
        if (externalProducts && externalProducts.length > 0) {
            setProducts(externalProducts);
            setLoading(false);
            setTotalProducts(externalTotal ?? externalProducts.length);
        } else if (externalProducts && externalProducts.length === 0) {
            setProducts([]);
            setLoading(false);
            setTotalProducts(0);
        }
    }, [externalProducts, externalTotal]);

    const updateProductStatusInState = (id: number, newStatus: "active" | "inactive") => {
        setProducts((prev: Product[]) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    };

    const fetchProducts = useCallback(
        async (pageIndex: number, search: string = "") => {
            if (externalProducts && externalProducts.length > 0) return;

            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await listProducts(pagination.pageSize, offset, search, type, status);
                setProducts(response.data || []);
                setTotalProducts(response.total || 0);
                setItemStats(response.stats || itemStats);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching products.");
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pagination.pageSize, type, status, externalProducts]
    );

    const debouncedFetchProducts = useMemo(
        () =>
            debounce((pageIndex: number, search: string) => {
                fetchProducts(pageIndex, search);
            }, 300),
        [fetchProducts]
    );

    useEffect(() => {
        if (!externalProducts || externalProducts.length === 0) {
            debouncedFetchProducts(pagination.pageIndex, search);
        }
        return () => debouncedFetchProducts.cancel();
    }, [pagination.pageIndex, debouncedFetchProducts, search, externalProducts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleEdit = (product: Product) => {
        onEdit?.(product);
    };

    const handleDeleteConfirm = (productId: number) => {
        onDeleteConfirm?.(productId);
    };

    const handleStatusChange = async (productId: number, selected: Option, revert: () => void) => {
        try {
            await updateItemStatus(productId, selected.value);
            toast.success("Status updated");
            updateProductStatusInState(productId, selected.value as "active" | "inactive");
        } catch {
            toast.error("Failed to update status");
            revert();
        }
    };

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: "Item",
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
                                {category && <span className="text-xs text-gray-500">{category}</span>}
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
                    const stars = Math.round(rating);

                    return (
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, index) => (
                                <StarIcon key={index} className={`w-4 h-4 ${index < stars ? "text-green-500" : "text-gray-300"}`} />
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

                    const formattedSales = `${formatAmount(salesPrice)}`;
                    const formattedRegular = `${formatAmount(regularPrice)}`;

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
                    const max = 100;
                    const badgeClass = getStockBadgeClass(quantity, max);

                    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass}`}>{quantity}</span>;
                },
            },
            {
                header: "Views",
                accessorKey: "views",
                cell: ({ getValue }) => {
                    const views = getValue() as number;
                    return (
                        <div className="flex items-center gap-1 text-gray-700">
                            <EyeIcon className="w-4 h-4 text-green-600" />
                            <span>{views}</span>
                        </div>
                    );
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const product = row.original;
                    const initial = product.status ?? "inactive";
                    const selectedOption = statusOptions.find((s) => s.value === initial) ?? statusOptions[0];

                    return (
                        <SelectDropdown
                            value={selectedOption}
                            options={statusOptions}
                            onChange={(opt) => {
                                const revert = () => {
                                };
                                handleStatusChange(product.id, opt, revert);
                            }}
                        />
                    );
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
                cell: ({ row }) => {
                    const product = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600 flex items-center gap-1 cursor-pointer"
                            >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteConfirm(product.id)}
                                className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 flex items-center gap-1 cursor-pointer"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <ItemSummary loading={loading} stats={itemStats} />
            <ProductAreaChart type={type} status={status} />

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-green-600 text-gray-900"
                />
            </div>

            <TanStackTable
                data={products}
                columns={columns}
                loading={externalLoading ?? loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: externalTotal ?? totalProducts,
                }}
                onPaginationChange={(updatedPagination) =>
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    })
                }
            />
        </div>
    );
}
