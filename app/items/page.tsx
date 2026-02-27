"use client";

import { useEffect, useState, useCallback } from "react";
import ProductsTable from "./components/ProductsTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "../components/commons/Drawer";
import ConfirmationModal from "../components/commons/ConfirmationModal";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { listProducts, deleteProduct } from "@/lib/api/products";
import { Product } from "@/types/ProductType";
import ItemForm from "./components/ItemForm";

type Option = { label: string; value: string };

const typeOptions: Option[] = [
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

export default function Products() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    
    const [selectedType, setSelectedType] = useState<string>("products");

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const LIMIT = 10;

   const fetchProducts = useCallback(async (limit = LIMIT, offset = 0, search = "") => {
        try {
            setLoading(true);
            const resp = await listProducts(limit, offset, search, selectedType, "active");
            setProducts(resp?.data || []);
            setTotal(resp?.total ?? 0);
        } catch (err) {
            console.error("Failed to fetch", err);
        } finally {
            setLoading(false);
        }
    }, [selectedType]); 
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setDrawerOpen(true);
    };

    const handleConfirmDelete = (productId: number) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async () => {
        if (!selectedProductId) return;
        const idToDelete = selectedProductId;
        setIsModalOpen(false);
        setLoading(true);

        try {
            await deleteProduct(idToDelete);
            setProducts((prev) => prev.filter((p) => p.id !== idToDelete));
            setTotal((prev) => prev - 1);
            await fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
            await fetchProducts();
        } finally {
            setLoading(false);
            setSelectedProductId(null);
        }
    };

    const handleFormSuccess = async () => {
        await fetchProducts();
        setDrawerOpen(false);
        setEditingProduct(null);
    };

    const currentTypeOption = typeOptions.find(opt => opt.value === selectedType) || typeOptions[0];

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Items</h1>
                    <p className="text-sm text-gray-600">
                        Manage your {selectedType} here.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-40">
                        <SelectDropdown
                            options={typeOptions}
                            value={currentTypeOption}
                            onChange={(selected) => setSelectedType(selected.value)}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Confirmation modal for delete */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Product Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this item? This action
                    cannot be undone.
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
                        onClick={handleDeleteProduct}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </ConfirmationModal>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingProduct(null);
                }}
                title={editingProduct ? "Edit Item" : "Create Item"}
            >
                <ItemForm
                    item={editingProduct}
                    onClose={() => setDrawerOpen(false)}
                    // onSuccess={handleFormSuccess}
                />
            </Drawer>

           <ProductsTable
                limit={LIMIT}
                type={selectedType}
                status="active"
                products={products}
                total={total}
                loading={loading}
                onEdit={handleEditProduct}
                onDeleteConfirm={handleConfirmDelete}
                onRefresh={fetchProducts} 
            />
        </div>
    );
}