'use client';

import { useState } from "react";
import SubCategoriesTable from "../components/SubCategoriesTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import SubCategoryForm from "../components/SubCategoryForm";
import { FlattenedSubCategory } from "@/types/CategoryType";
import { deleteCategory } from "@/app/api_/categories";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";

export default function Sub() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<FlattenedSubCategory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<FlattenedSubCategory | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEdit = (category: FlattenedSubCategory) => {
        setEditingCategory(category);
        setDrawerOpen(true);
    };

    const confirmDelete = (category: FlattenedSubCategory) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setLoading(true);
        try {
            await deleteCategory(categoryToDelete.id);
            toast.success("Subcategory deleted successfully.");
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
                    <h1 className="text-2xl font-bold text-gray-800">Sub categories</h1>
                    <p className="text-sm text-gray-600">Manage your sub-categories here.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="w-48">

                    </div>

                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Subcategory
                    </button>
                </div>
            </div>

            <SubCategoriesTable
                limit={10}
                type={"products"}
                onEdit={handleEdit}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? "Edit Sub-category" : "Create Sub-category"}
            >
                <SubCategoryForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                    category={editingCategory ?? undefined}
                />
            </Drawer>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this sub category? This action cannot be undone.
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
