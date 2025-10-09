"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { BannerType } from "@/types/CategoryType";
import { TrashIcon } from "@heroicons/react/24/outline";
import { listBannerTypes } from "@/app/api_/banners";

type BannerProps = {
    limit: number;
    onDelete: (category: BannerType) => void;
};

const BannerTypesTable: React.FC<BannerProps> = ({ limit, onDelete }) => {
    const [banners, setBanners] = useState<BannerType[]>([]);
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
                header: "Banner Type",
                accessorKey: "name",
            },
            
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => onDelete(row.original)}
                            className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [onDelete]
    );

    const fetchBanners = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listBannerTypes(pageSize, offset);
            setBanners(response.data);
            console.log(response);
            setTotal(response.total);
        } catch (err) {
            console.error(err);
            setError("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;
    useEffect(() => {
        fetchBanners(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={banners}
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

export default BannerTypesTable;
