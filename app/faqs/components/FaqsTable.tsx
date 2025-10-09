"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { deleteFaq, listFaqs, updateStatus } from "@/app/api_/faqs";
import { Faq } from "@/types/FaqType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { Switch } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import FaqForm from "@/app/faqs/components/FaqsForm";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import axios from "axios";

interface FaqsTableProps {
    limit: number;
    type?: string;
}

const FaqsTable: React.FC<FaqsTableProps> = ({ limit, type }) => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");


    // 🔹 State for deletion modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalFaqs, setTotalFaqs] = useState(0);

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

    function StatusSwitch({ id, initialStatus }: { id: string; initialStatus: string }) {
        const [enabled, setEnabled] = useState(initialStatus === "active");

        const handleToggle = async () => {
            const newStatus = enabled ? "inactive" : "active";

            try {
                await updateStatus(id, newStatus);
                setEnabled(!enabled);
                toast.success(`Status updated to ${newStatus}`);
            } catch {
                toast.error("Failed to update status");
            }
        };

        return (
            <Switch
                checked={enabled}
                onChange={handleToggle}
                className={`${enabled ? "bg-green-600" : "bg-gray-300"}
          relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span
                    className={`${enabled ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
            </Switch>
        );
    }

    const handleDelete = async () => {
        if (!faqToDelete) return;
        setLoading(true);
        try {
            await deleteFaq(faqToDelete);
            toast.success("FAQ deleted successfully");
            setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete));  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Failed to delete FAQ";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsModalOpen(false);
            setFaqToDelete(null);
            setLoading(false);
        }
    };


    const columns: ColumnDef<Faq>[] = useMemo(
        () => [
            {
                header: "Question",
                accessorKey: "question",
                cell: ({ getValue }) => (
                    <span className="font-medium text-gray-800">{getValue() as string}</span>
                ),
            },
            {
                header: "Answer",
                accessorKey: "answer",
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-700 truncate w-60 overflow-hidden whitespace-nowrap block">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                header: "Type",
                accessorKey: "type",
                cell: ({ getValue }) => (
                    <span className="capitalize text-sm text-gray-800">{getValue() as string}</span>
                ),
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <StatusSwitch id={row.original.id} initialStatus={row.original.status} />
                ),
            },

            {
                header: "Actions",
                accessorKey: "actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {/* Edit button */}
                        <button
                            onClick={() => {
                                setEditingFaq(row.original);
                                setDrawerOpen(true);
                            }}
                            className="p-2 text-white hover:text-blue-800 bg-amber-500 rounded-xl cursor-pointer"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>

                        {/* Delete button (opens modal) */}
                        <button
                            onClick={() => {
                                setFaqToDelete(row.original.id);
                                setIsModalOpen(true);
                            }}
                            className="p-2 text-white hover:text-green-800 bg-green-500 rounded-xl cursor-pointer"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return <span className="text-sm">{formatHumanReadableDate(value)}</span>;
                },
            },
        ],
        []
    );

    const fetchFaqs = useCallback(
        async (pageIndex: number, search: string = "") => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await listFaqs(pagination.pageSize, offset, type, search);
                setFaqs(response.data || []);
                setTotalFaqs(response.total || 0);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching FAQs.");
                toast.error("Failed to load FAQs");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, type]
    );

    const debouncedFetch = useMemo(() => {
        return debounce((pageIndex: number, search: string) => {
            fetchFaqs(pageIndex, search);
        }, 300);
    }, [fetchFaqs]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => {
            debouncedFetch.cancel();
        };
    }, [pagination.pageIndex, debouncedFetch, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by question..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
                />
            </div>

            <TanStackTable
                data={faqs}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalFaqs,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />

            {/* 🔹 Drawer for Editing FAQ */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingFaq(null);
                }}
                title={editingFaq ? "Edit FAQ" : "Create FAQ"}
            >
                <FaqForm
                    faq={editingFaq ?? undefined}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingFaq(null);
                    }}
                />
            </Drawer>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this FAQ? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                        onClick={handleDelete}
                    >
                       {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
};

export default FaqsTable;
