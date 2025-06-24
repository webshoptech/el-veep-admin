"use client";

import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
 
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

    // Render loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    // Render empty state
    if (data.length === 0) {
        return <div>No data available</div>;
    }

    // Render pagination controls
    const renderPagination = () => {
        if (!pagination) return null;

        return (
            <div className="flex items-center justify-between mt-4 p-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => onPaginationChange?.({ 
                        pageIndex: pagination.pageIndex - 1, 
                        pageSize: pagination.pageSize 
                    })}
                    disabled={pagination.pageIndex === 0}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.pageIndex + 1} of {Math.ceil(pagination.totalRows / pagination.pageSize)}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => onPaginationChange?.({ 
                        pageIndex: pagination.pageIndex + 1, 
                        pageSize: pagination.pageSize 
                    })}
                    disabled={
                        pagination.pageIndex >= 
                        Math.ceil(pagination.totalRows / pagination.pageSize) - 1
                    }
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto text-left border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-2 text-sm font-medium text-gray-600">
                                    {header.isPlaceholder 
                                        ? null 
                                        : flexRender(
                                            header.column.columnDef.header, 
                                            header.getContext()
                                        )
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-t">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                                    {flexRender(
                                        cell.column.columnDef.cell, 
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {renderPagination()}
        </div>
    );
}

export default TanStackTable;