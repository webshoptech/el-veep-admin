'use client';

import { Fragment, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import { BannerType } from "@/types/CategoryType";
import toast from "react-hot-toast";
import { Transition, Dialog, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import BannersForm from "../categories/components/BannersForm";
import BannersTable from "../categories/components/BannersTable";
import { deleteBanner } from "../api_/banners";
import ConfirmationModal from "../components/commons/ConfirmationModal";

export default function Banners() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BannerType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<BannerType | null>(null);
    const [loading, setLoading] = useState(false);



    const confirmDelete = (category: BannerType) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setLoading(true);

        try {
            await deleteBanner(categoryToDelete.id);
            toast.success("Banner deleted successfully.");
            setIsModalOpen(false);
            setCategoryToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subcategory.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">App Banners</h1>
                    <p className="text-sm text-gray-600">Manage your app banners here.</p>
                </div>

                <div className="flex gap-3 items-center">


                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Banner
                    </button>
                </div>
            </div>

            <BannersTable
                limit={10}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? "Edit Banner" : "Create Banner"}
            >
                <BannersForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                    category={editingCategory ?? undefined}
                />
            </Drawer>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this banner? This action cannot be undone.
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
        </div>
    );
}
