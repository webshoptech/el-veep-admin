"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown"; // Import the shared component
import { listSubCategories } from "@/lib/api/categories";
import { CategoryType, FlattenedSubCategory } from "@/types/CategoryType";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const TYPE_OPTIONS = [
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

type SubcategoryProps = {
    limit: number;
    initialType: string; // Renamed from type to avoid conflict with local state
    onEdit: (category: FlattenedSubCategory) => void;
    onDelete: (category: FlattenedSubCategory) => void;
};

type FetchArgs = {
    offset: number;
    pageSize: number;
    searchTerm: string;
    type: string;
};

const SubCategoriesTable: React.FC<SubcategoryProps> = ({ limit, initialType, onEdit, onDelete }) => {
    const [categories, setSubCategories] = useState<FlattenedSubCategory[]>([]);
    const [selectedType, setSelectedType] = useState(initialType || "products"); // Local state for dropdown

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    // Determine the current dropdown value object
    const currentTypeOption = useMemo(() => 
        TYPE_OPTIONS.find(opt => opt.value === selectedType) || TYPE_OPTIONS[0],
    [selectedType]);

    const columns: ColumnDef<FlattenedSubCategory>[] = useMemo(
        () => [
            {
                header: "Subcategory",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span className="text-gray-800 font-medium">{row.original.name}</span>
                ),
            },
            {
                header: "Parent Category",
                accessorKey: "parent_name",
                cell: ({ row }) => (
                    <span className="text-sm text-gray-700">
                        {row.original.parent_name ?? "N/A"}
                    </span>
                ),
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(row.original)}
                            className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 cursor-pointer flex items-center gap-1 text-sm transition-colors"
                        >
                            <PencilSquareIcon className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 cursor-pointer flex items-center gap-1 text-sm transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                    </div>
                ),
            }
        ],
        [onEdit, onDelete]
    );

    const fetchSubCategories = async ({ offset, pageSize, searchTerm, type }: FetchArgs) => {
        try {
            setLoading(true);
            const response = await listSubCategories(pageSize, offset, searchTerm, type);

            const flattened: FlattenedSubCategory[] = response.data.flatMap((parent: CategoryType) =>
                (parent.children || []).map((child: CategoryType) => ({
                    ...child,
                    parent_name: parent.name,
                    parent_id: parent.id,
                    parent_slug: parent.slug,
                    type: parent.type, // Ensure type is passed through
                }))
            );

            setSubCategories(flattened);
            setTotal(response.total || flattened.length);
        } catch (err) {
            console.error(err);
            setError("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(
        () => debounce((args: FetchArgs) => fetchSubCategories(args), 500),
        []
    );

    const { pageIndex, pageSize } = pagination;

    useEffect(() => {
        debouncedFetch({
            offset: pageIndex * pageSize,
            pageSize,
            searchTerm: search,
            type: selectedType, // Use local state here
        });

        return () => {
            debouncedFetch.cancel();
        };
    }, [pageIndex, pageSize, search, selectedType, debouncedFetch]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Search Input */}
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Subcategories</label>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>

                {/* Type Select Dropdown */}
                <div className="w-full md:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                    <SelectDropdown
                        options={TYPE_OPTIONS}
                        value={currentTypeOption}
                        onChange={(opt) => {
                            setSelectedType(opt.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to page 1 on filter change
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
                    pageIndex,
                    pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) => setPagination(newPagination)}
            />
        </div>
    );
};

export default SubCategoriesTable;