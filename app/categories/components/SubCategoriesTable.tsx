"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listSubCategories } from "@/app/api_/categories";
import { FlattenedSubCategory, CategoryType } from "@/types/CategoryType";

type SubcategoryProps = {
    limit: number;
    type: string;
};

const SubCategoriesTable: React.FC<SubcategoryProps> = ({ limit, type }) => {
    const [categories, setSubCategories] = useState<FlattenedSubCategory[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

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
                cell: () => (
                    <button className="text-amber-600 hover:underline">Edit</button>
                ),
            },
        ],
        []
    );

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                setLoading(true);
                const offset = pagination.pageIndex * pagination.pageSize;

                const response = await listSubCategories(
                    pagination.pageSize,
                    offset,
                    search,
                    type
                );

                const flattened: FlattenedSubCategory[] = response.data.flatMap(
                    (parent: CategoryType) =>
                        (parent.children || []).map((child: CategoryType) => ({
                            id: child.id,
                            name: child.name,
                            slug: child.slug,
                            parent_id: parent.id,
                            parent_name: parent.name,
                            parent_slug: parent.slug,
                        }))
                );

                setSubCategories(flattened);
                setTotal(response.total);
            } catch (err) {
                console.error(err);
                setError("Failed to load subcategories");
            } finally {
                setLoading(false);
            }
        };

        fetchSubCategories();
    }, [pagination.pageIndex, pagination.pageSize, search, type]);

    return (
        <div className="space-y-6">
            <input
                type="text"
                placeholder="Search by subcategory name..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full px-3 py-2 border border-amber-600 rounded-md text-gray-900"
            />

            <TanStackTable
                data={categories}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) => setPagination(newPagination)}
            />
        </div>
    );
};

export default SubCategoriesTable;
