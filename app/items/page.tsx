"use client";

import { useEffect, useState } from "react";
import ProductsTable from "./components/ProductsTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "../components/commons/Drawer";
import ProductForm from "./components/ProductForm";
import ConfirmationModal from "../components/commons/ConfirmationModal";
import { listProducts, deleteProduct } from "@/lib/api/products";
import { Product } from "@/types/ProductType";
import ItemForm from "./components/ItemForm";

export default function Products() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const LIMIT = 10;

    const fetchProducts = async (limit = LIMIT, offset = 0, search = "") => {
        try {
            setLoading(true);
            const resp = await listProducts(limit, offset, search, "products", "active");
            setProducts(resp?.data || []);
            setTotal(resp?.total ?? 0);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
        setLoading(true);
        try {
            await deleteProduct(selectedProductId);
            await fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            setSelectedProductId(null);
        }
    };

    const handleFormSuccess = async () => {
        await fetchProducts();
        setDrawerOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Items</h1>
                    <p className="text-sm text-gray-600">Manage your items here.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setDrawerOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4" />
                    Create Product
                </button>
            </div>

            {/* Confirmation modal for delete */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Product Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this product? This action cannot be undone.
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
                title={editingProduct ? "Edit Product" : "Create Product"}
            >
                <ItemForm
                    item={editingProduct}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>

            <ProductsTable
                limit={LIMIT}
                type="products"
                status="active"
                products={products}
                onEdit={handleEditProduct} // called when user clicks Edit in the table
                onDeleteConfirm={handleConfirmDelete} // called when user clicks Delete in the table
                loading={loading}
                total={total}
            />
        </div>
    );
}
