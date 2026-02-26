"use client";

import React, { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { updateItemStatus } from "@/lib/api/products";
import TanStackTable from "@/app/components/commons/TanStackTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import StatusBadge from "@/utils/StatusBadge";
import toast from "react-hot-toast";
import { deleteCategory, getCategories } from "@/lib/api/categories";
import CategorySummary from "./CategorySummary";
import { CategoryType } from "@/types/CategoryType";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import CategoryForm from "./CategoryForm";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";

interface CategoryTableProps {
    limit: number;
    type: string;
    status: string;
}

type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const typeOptions: Option[] = [
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

function CategoryActionCell({
    category,
    onStatusUpdate,
    onEdit,
}: {
    category: CategoryType;
    onStatusUpdate: (newStatus: "active" | "inactive") => void;
    onEdit: (cat: CategoryType) => void;
}) {
    const [status, setStatus] = useState<Option>(
        statusOptions.find((opt) => opt.value === category.status) || statusOptions[0]
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (selected: Option) => {
        const previous = status;
        setStatus(selected);
        try {
            await updateItemStatus(category.id, selected.value);
            onStatusUpdate(selected.value as "active" | "inactive");
            toast.success("Category status updated.");
            window.location.reload();
        } catch {
            setStatus(previous);
            toast.error("Failed to update category status.");
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCategory(category.id);
            toast.success("Category deleted.");
            setIsModalOpen(false);
            window.location.reload();
        } catch {
            toast.error("Failed to delete category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <SelectDropdown
                    value={status}
                    options={statusOptions}
                    onChange={handleStatusChange}
                    className="w-auto min-w-35"
                />

                <button
                    title="Update"
                    className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600 flex items-center gap-1 cursor-pointer"
                    onClick={() => onEdit(category)}
                >
                    <PencilSquareIcon className="w-4 h-4" /> Edit
                </button>

                <button
                    title="Delete"
                    className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 flex items-center gap-1 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <TrashIcon className="w-4 h-4" /> Delete
                </button>
            </div>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this category? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 cursor-pointer"
                        onClick={handleDelete}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </ConfirmationModal>
        </>
    );
}

const CategoriesTable: React.FC<CategoryTableProps> = ({ limit, type: initialType }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    // ADDED: Local state for Type filter
    const [selectedType, setSelectedType] = useState<string>(initialType || "products");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalCategories, setTotalCategories] = useState(0);
    const [itemStats, setItemStats] = useState({
        total_items: 0,
        total_active: 0,
        total_inactive: 0,
        total_service: 0,
        total_product: 0,
    });
    const { setCategories: saveToStore } = useCategoryStore();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

    const updateCategoryStatusInState = (id: number, newStatus: "active" | "inactive") => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
    };

    const columns: ColumnDef<CategoryType>[] = useMemo(
        () => [
            {
                header: "Category",
                accessorKey: "name",
                cell: ({ row }) => {
                    const { image, name, slug } = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <Image
                                src={image || "/placeholder.png"}
                                alt={name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{name}</span>
                                <span className="text-xs text-gray-500">{slug}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Description",
                accessorKey: "description",
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-700 truncate w-40 overflow-hidden whitespace-nowrap block">
                        {(getValue() as string) || "N/A"}
                    </span>
                ),
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ getValue }) => {
                    const status = getValue() as "active" | "inactive";
                    return <StatusBadge status={status} />;
                },
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return <span className="text-sm">{formatHumanReadableDate(value)}</span>;
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => {
                    const category = row.original;
                    return (
                        <CategoryActionCell
                            category={category}
                            onStatusUpdate={(newStatus) =>
                                updateCategoryStatusInState(category.id, newStatus)
                            }
                            onEdit={(cat) => {
                                setEditingCategory(cat);
                                setDrawerOpen(true);
                            }}
                        />
                    );
                },
            },
        ],
        []
    );

    const fetchCategories = useCallback(
        async (pageIndex: number, search: string = "", typeToFetch: string) => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                // UPDATED: Now uses typeToFetch from local state
                const response = await getCategories(pagination.pageSize, offset, search, typeToFetch);
                saveToStore(response.data);
                setCategories(response.data);
                setTotalCategories(response.total || 0);
                setItemStats(response.stats);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching categories.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, saveToStore]
    );

    const debouncedFetch = useMemo(() => {
        return debounce((pageIndex: number, search: string, typeToFetch: string) => {
            fetchCategories(pageIndex, search, typeToFetch);
        }, 300);
    }, [fetchCategories]);

    useEffect(() => {
        // UPDATED: Added selectedType to dependency and fetch call
        debouncedFetch(pagination.pageIndex, search, selectedType);
        return () => {
            debouncedFetch.cancel();
        };
    }, [pagination.pageIndex, debouncedFetch, search, selectedType]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    // Helper for SelectDropdown value
    const currentTypeOption = typeOptions.find(o => o.value === selectedType) || typeOptions[0];

    return (
        <div className="space-y-6">
            <CategorySummary loading={loading} stats={itemStats} />

            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by category name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border rounded-md border-green-600 text-gray-900"
                    />
                </div>

                {/* ADDED: Type Filter Dropdown */}
                <div className="w-full md:w-64">
                    <SelectDropdown
                        options={typeOptions}
                        value={currentTypeOption}
                        onChange={(selected) => {
                            setSelectedType(selected.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            <TanStackTable
                data={categories}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalCategories,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <CategoryForm
                    category={editingCategory ?? undefined}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                />
            </Drawer>
        </div>
    );
};

export default CategoriesTable;