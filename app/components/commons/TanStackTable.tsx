"use client";

import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import TableSkeleton from "../Skeletons/TableSkeleton";

interface TanStackTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    loading?: boolean;
    error?: string | null;
    itemsPerPage?: number;
    pagination?: {
        pageIndex: number;
        pageSize: number;
        totalRows: number;
    };
    onPaginationChange?: (pagination: {
        pageIndex: number;
        pageSize: number;
    }) => void;
}

function TanStackTable<T>({
    data,
    columns,
    loading = false,
    error,
    pagination,
    onPaginationChange,
}: TanStackTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pagination
            ? Math.ceil(pagination.totalRows / pagination.pageSize)
            : 0,
        state: {
            pagination: pagination
                ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
                : undefined,
        },
        onPaginationChange: (updater) => {
            if (onPaginationChange) {
                const newPagination =
                    typeof updater === 'function'
                        ? updater({
                            pageIndex: pagination?.pageIndex || 0,
                            pageSize: pagination?.pageSize || 10
                        })
                        : updater;

                onPaginationChange(newPagination);
            }
        },
    });


    return loading ? (
        <TableSkeleton columns={columns.length} rows={pagination?.pageSize} />
    ) : error ? (
        <div className="text-red-500">Error: {error}</div>
    ) : data.length === 0 ? (
        <div>No data available</div>
    ) : (
        <div className="overflow-x-auto w-full bg-white rounded-lg">
            <table className="min-w-full table-auto text-left border border-gray-200">
                <thead className="bg-yellow-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-sm font-medium border-l-yellow-700 border-l text-gray-600"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-t hover:bg-yellow-50 transition-colors duration-150"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>


            {pagination && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4  gap-2 sm:gap-0">
                    {/* Summary text */}
                    <div className="text-sm text-gray-700 font-semibold">
                        Showing{" "}
                        <span className="text-yellow-900">
                            {pagination.pageIndex * pagination.pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="text-yellow-900">
                            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.totalRows)}
                        </span>{" "}
                        of <span className="text-yellow-900">{pagination.totalRows}</span> total
                    </div>

                    {/* Page controls */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="px-4 py-2 bg-yellow-900 rounded-lg disabled:opacity-50 font-bold flex items-center text-white"
                            onClick={() =>
                                onPaginationChange?.({
                                    pageIndex: pagination.pageIndex - 1,
                                    pageSize: pagination.pageSize,
                                })
                            }
                            disabled={pagination.pageIndex === 0}
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Previous
                        </button>

                        <span className="text-sm text-gray-600 font-bold">
                            Page {pagination.pageIndex + 1} of{" "}
                            {Math.max(Math.ceil(pagination.totalRows / pagination.pageSize), 1)}
                        </span>

                        <button
                            className="px-4 py-2 bg-yellow-900 rounded-lg disabled:opacity-50 font-bold flex items-center text-white"
                            onClick={() =>
                                onPaginationChange?.({
                                    pageIndex: pagination.pageIndex + 1,
                                    pageSize: pagination.pageSize,
                                })
                            }
                            disabled={
                                pagination.pageIndex >=
                                Math.ceil(pagination.totalRows / pagination.pageSize) - 1
                            }
                        >
                            Next <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );

}

export default TanStackTable;