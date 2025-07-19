'use client';
import { useState } from "react";
import SubCategoriesTable from "../components/SubCategoriesTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import SubCategoryForm from "../components/SubCategoryForm";

const typeOptions = [
    { label: "Product Items", value: "products" },
    { label: "Service Items", value: "services" },
];

export default function Sub() {
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    return (
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sub categories</h1>
                    <p className="text-sm text-gray-600">Manage your sub-categories here.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="w-48">
                        <SelectDropdown
                            options={typeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Subcategory
                    </button>
                </div>
            </div>
            <SubCategoriesTable
                limit={10}
                type={selectedType.value}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Sub-category"
            >
                <SubCategoryForm onClose={() => setDrawerOpen(false)} />
            </Drawer>
        </div>
    );
}
