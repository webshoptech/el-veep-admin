'use client';

import { useEffect, useMemo, useState } from 'react';
import { Shop } from '@/types/ShopType';
import { ColumnDef } from '@tanstack/react-table';
import TanStackTable from '@/app/components/commons/TanStackTable';
import { getShops } from '../api_/shop';
import Image from 'next/image';
import StatusBadge from '@/utils/StatusBadge';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Shops() {
    const [data, setData] = useState<Shop[]>([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            try {
                const res = await getShops({
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize,
                });
                setData(res.data);
                setTotal(res.total);
            } catch {
                setError('Failed to fetch shops.');
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, [pagination]);

    const columns: ColumnDef<Shop>[] = useMemo(
        () => [
            {
                header: 'Shop',
                accessorKey: 'name',
                cell: ({ row }) => {
                    const { name, logo, type, category } = row.original;

                    return (
                        <div className="flex items-center gap-3">
                            {logo && (
                                <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                                    <Image src={logo} alt={name} fill className="object-cover" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-medium leading-tight">{name}</span>
                                <span className="text-xs text-gray-500">{type} | {category?.name}</span>
                            </div>
                        </div>
                    );
                },
            },


            {
                header: 'Vendor',
                accessorKey: 'vendor.name',
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    return (
                        <div className="text-sm">
                            <div className="font-medium text-gray-900">{vendor?.name} {vendor?.last_name}</div>
                            <div className="text-xs text-gray-500">{vendor?.city}, {vendor?.state}</div>
                        </div>
                    );
                },
            },

            {
                header: 'Pickup Address',
                accessorKey: 'address',
                cell: ({ row }) => {

                    return (
                        <span className="text-gray-600 text-sm">
                            {row.original.address}
                        </span>
                    );
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <StatusBadge status={row.original.status} />
                ),
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: ({ row }) => {
                    return (
                        <span className="text-sm text-gray-500">
                            {formatHumanReadableDate(row.original.created_at)}
                        </span>
                    );
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <Link
                        href={`/shops/${row.original.slug}`}
                        target='_blank'
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                        View
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </Link>
                ),
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
                <p className="text-gray-600 text-sm">Manage your vendor shops here.</p>
            </div>

            <TanStackTable
                data={data}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: total,
                }}
                onPaginationChange={setPagination}
            />
        </div>
    );
}
