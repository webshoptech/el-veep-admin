"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Product, Stats } from "@/types/ProductType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listProducts, updateItemStatus } from "@/lib/api/products";
import ItemSummary from "./ItemSummary";
import { getStockBadgeClass } from "@/utils/StockBadge";
import { EyeIcon, PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";
import { formatAmount } from "@/utils/formatCurrency";

type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "Published", value: "active" },
    { label: "Draft", value: "inactive" },
];

const typeOptions: Option[] = [
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

interface ProductTableProps {
    limit: number;
    type: string;
    status: string;
    products?: Product[];
    onEdit?: (product: Product) => void;
    onDeleteConfirm?: (productId: number) => void;
    loading?: boolean;
    total?: number;
    onTypeChange?: (newType: string) => void; 
    onRefresh: (limit: number, offset: number, search: string) => void;
}

export default function ProductsTable({
    limit,
    type: initialType,
    status,
    products: externalProducts,
    onEdit,
    onDeleteConfirm,
    loading: externalLoading,
    total: externalTotal,
    onTypeChange,
    onRefresh
}: ProductTableProps) {
        const [products, setProducts] = useState<Product[]>(externalProducts ?? []);
    const [currentType, setCurrentType] = useState(initialType); 
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
        total_categories: 0,
    });

    useEffect(() => {
        setProducts(externalProducts ?? []);
        setTotalProducts(externalTotal ?? (externalProducts?.length || 0));
    }, [externalProducts, externalTotal]);

    useEffect(() => {
        setCurrentType(initialType);
    }, [initialType]);

    const updateProductStatusInState = useCallback((id: number, newStatus: "active" | "inactive") => {
        setProducts((prev: Product[]) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
    }, []);

   

    const fetchProducts = useCallback(
        async (pageIndex: number, search: string = "", typeToFetch: string) => { 
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await listProducts(pagination.pageSize, offset, search, typeToFetch, status);
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
        [pagination.pageSize, status, itemStats]
    );

    const debouncedFetchProducts = useMemo(
        () =>
            debounce((pageIndex: number, search: string, typeToFetch: string) => {
                fetchProducts(pageIndex, search, typeToFetch);
            }, 300),
        [fetchProducts]
    );

    useEffect(() => {
        debouncedFetchProducts(pagination.pageIndex, search, currentType);
        return () => debouncedFetchProducts.cancel();
    }, [pagination.pageIndex, debouncedFetchProducts, search, currentType]); 
    useEffect(() => {
        const offset = pagination.pageIndex * pagination.pageSize;
        
        const delayDebounce = setTimeout(() => {
            onRefresh(pagination.pageSize, offset, search);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, pagination.pageIndex, pagination.pageSize, onRefresh]);
 
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [currentType]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleTypeChange = (selected: Option) => {
        setCurrentType(selected.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        if (onTypeChange) onTypeChange(selected.value);
    };

    const handleStatusChange = useCallback(async (productId: number, selected: Option) => {
        try {
            await updateItemStatus(productId, selected.value);
            toast.success("Status updated");
            updateProductStatusInState(productId, selected.value as "active" | "inactive");
        } catch {
            toast.error("Failed to update status");
        }
    }, [updateProductStatusInState]);

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
                header: "Price",
                cell: ({ row }) => {
                    const salesPrice = parseFloat(row.original.sales_price || "0");
                    return <span className="text-gray-800 font-semibold">{formatAmount(salesPrice)}</span>;
                },
            },
            {
                header: "Stock",
                accessorKey: "quantity",
                cell: ({ getValue }) => {
                    const qty = getValue() as number;
                    const badgeClass = getStockBadgeClass(qty, 100);
                    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass}`}>{qty}</span>;
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const initial = row.original.status ?? "inactive";
                    const selectedOption = statusOptions.find((s) => s.value === initial) ?? statusOptions[0];
                    return (
                        <SelectDropdown
                            value={selectedOption}
                            options={statusOptions}
                            onChange={(opt) => handleStatusChange(row.original.id, opt)}
                        />
                    );
                },
            },
            {
                header: "Action",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <button onClick={() => onEdit?.(row.original)} className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteConfirm?.(row.original.id)} className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [onEdit, onDeleteConfirm, handleStatusChange]
    );

    return (
        <div className="space-y-6">
            <ItemSummary loading={loading} stats={itemStats} />

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Search input */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border rounded-md border-green-600 text-gray-900"
                    />
                </div> 
            </div>

            <TanStackTable
                data={products}
                columns={columns}
                loading={externalLoading ?? loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalProducts,
                }}
                onPaginationChange={(updated) => setPagination({ pageIndex: updated.pageIndex, pageSize: updated.pageSize })}
            />
        </div>
    );
}