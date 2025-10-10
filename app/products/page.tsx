'use client';

import { useState } from "react";
import ProductsTable from "./components/ItemsTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "../components/commons/Drawer";
import ProductForm from "./components/ProductForm";

export default function Products() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Items</h1>
                    <p className="text-sm text-gray-600">Manage your items here.</p>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4" />
                    Create Product
                </button>
            </div>


            {/* Products Table */}
            <ProductsTable limit={10} type="products" status="active" />
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Product"
            >
                <ProductForm onClose={() => setDrawerOpen(false)} />
            </Drawer>
        </div>
    );
}
