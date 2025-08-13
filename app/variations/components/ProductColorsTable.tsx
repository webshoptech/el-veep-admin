"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { BannerType } from "@/types/CategoryType";
import { TrashIcon } from "@heroicons/react/24/outline";
import { listColours } from "@/app/api_/colours";

type BannerProps = {
    limit: number;
    onDelete: (category: BannerType) => void;
};

const ProductColorsTable: React.FC<BannerProps> = ({ limit, onDelete }) => {
    const [colors, setColors] = useState<BannerType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<BannerType>[] = useMemo(
        () => [
            {
                header: "Color name",
                accessorKey: "name",
            },

            {
                header: "Color hexacode",
                accessorKey: "hexcode",
                cell: ({ row }) => {
                    const hex = row.getValue<string>("hexcode");
                    return (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: hex }}
                            ></div>
                            <span>{hex}</span>
                        </div>
                    );
                },
            },


            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => onDelete(row.original)}
                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [onDelete]
    );

    const fetchColors = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listColours(pageSize, offset);
            setColors(response.data);
            console.log(response);
            setTotal(response.total);
        } catch (err) {
            console.error(err);
            setError("Failed to load colors");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;
    useEffect(() => {
        fetchColors(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={colors}
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

export default ProductColorsTable;
