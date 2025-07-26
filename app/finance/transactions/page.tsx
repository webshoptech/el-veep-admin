'use client';

import { getTransactions } from "@/app/api_/transactions";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { Transaction, TransactionResponse } from "@/types/TransactionType";
import { formatAmount } from "@/utils/formatCurrency";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import StatusBadge from "@/utils/StatusBadge";
import { EyeIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import ViewTransactionModal from "../components/ViewTransactionModal";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTransactions = useCallback(async (pageIndex: number, searchTerm: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: TransactionResponse = await getTransactions({
                limit: pagination.pageSize,
                offset: pageIndex * pagination.pageSize,
                search: searchTerm,
            });

            setTransactions(response.data);
            setTotalRows(Number(response.total));
        } catch {
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const debouncedFetch = useMemo(() => debounce(fetchTransactions, 300), [fetchTransactions]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => debouncedFetch.cancel();
    }, [pagination.pageIndex, search, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleView = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setIsModalOpen(true);
    };

    const columns: ColumnDef<Transaction>[] = useMemo(() => [
        {
            header: 'Receiver Name',
            accessorFn: (row) => `${row.transaction_data?.vendor?.name || "Bought"} ${row.transaction_data?.vendor?.last_name || row.type}`,
            cell: ({ getValue }) => <span>{getValue() as string}</span>,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ getValue }) => <span>{formatAmount(Number(getValue()))}</span>,
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ getValue }) => <span>{String(getValue())}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = String(getValue() || "").toLowerCase();
                return <StatusBadge status={status} />;
            },
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: ({ getValue }) => formatHumanReadableDate(getValue() as string),
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: ({ row }) => (
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => handleView(row.original)}
                        className="text-blue-600 bg-blue-100 p-1 rounded-lg hover:text-blue-800"
                        title="View"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                    <p className="text-sm text-gray-500">Monitor all vendor-related transactions.</p>
                </div>

                <div className="w-78">
                    <input
                        type="text"
                        placeholder="Search by vendor name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="mb-4 w-full max-w-sm text-gray-800 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                </div>
            </div>

            <TanStackTable
                data={transactions}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalRows,
                }}
                onPaginationChange={(updated) =>
                    setPagination({ pageIndex: updated.pageIndex, pageSize: updated.pageSize })
                }
            />

            {isModalOpen && selectedTransaction && (
                <ViewTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTransaction(null);
                    }}
                    transaction={selectedTransaction}
                />
            )}
        </>
    );
}
