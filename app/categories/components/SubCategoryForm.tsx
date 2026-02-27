"use client";

import { useState, useMemo, useEffect } from "react";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { useCategoryStore } from "@/app/store/CategoryStore";
import {
    addCategory,
    getCategories,
    updateCategory,
} from "@/lib/api/categories";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { CategoryType, FlattenedSubCategory } from "@/types/CategoryType";

const TYPE_OPTIONS = [
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

export default function SubCategoryForm({
    onClose,
    category,
    type: initialType, // Accept type from parent
}: {
    onClose: () => void;
    category?: FlattenedSubCategory;
    type?: string; // New prop
}) {
    const [name, setName] = useState(category?.name ?? "");
    
    // Prioritize: 1. Existing category type, 2. Type passed from parent, 3. Default "products"
    const [type, setType] = useState(category?.type || initialType || "products");
    
    const [selectedParent, setSelectedParent] = useState<{
        label: string;
        value: string;
    } | null>(
        category?.parent_id
            ? {
                  label: category.parent_name ?? "",
                  value: String(category.parent_id),
              }
            : null,
    );

    const { categories, setCategories: saveToStore } = useCategoryStore();
    const [loading, setLoading] = useState(false);

    // Sync state if initialType changes from parent while drawer is open
    useEffect(() => {
        if (initialType && !category) {
            setType(initialType);
        }
    }, [initialType, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories(100);
                saveToStore(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, saveToStore]);

    // Filter parent categories based on the selected Type
    const filteredCategoryOptions = useMemo(() => {
        return categories
            .filter((cat) => cat.type === type)
            .map((cat) => ({
                label: cat.name,
                value: String(cat.id),
            }));
    }, [categories, type]);

    const selectedTypeOption =
        TYPE_OPTIONS.find((opt) => opt.value === type) || TYPE_OPTIONS[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedParent || selectedParent.value === "") {
            toast.error("Please select a parent category");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("parent_id", selectedParent.value);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success("Sub category updated successfully");
            } else {
                await addCategory(formData);
                toast.success("Sub category added successfully");
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${category?.id ? "update" : "add"} sub category`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selector Section - Optional: disable if editing to prevent parent-child type mismatch */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-semibold text-green-800 mb-2">
                    Classification
                </label>
                <SelectDropdown
                    options={TYPE_OPTIONS}
                    value={selectedTypeOption}
                    onChange={(opt) => {
                        setType(opt.value);
                        setSelectedParent(null); // Reset parent if type changes
                    }}
                    className="w-full"
                />
                <p className="text-[11px] text-green-600 mt-2 italic">
                    * Selection filters the Parent Categories list below.
                </p>
            </div>

            {/* Sub Category Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub category Name
                </label>
                <input
                    type="text"
                    placeholder="e.g. Smart Phones, Web Design, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                />
            </div>

            {/* Filtered Parent Category Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category <span className="text-red-400">*</span>
                </label>
                <SelectDropdown
                    options={filteredCategoryOptions}
                    value={
                        selectedParent || { label: "Select parent category", value: "" }
                    }
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                />
                {filteredCategoryOptions.length === 0 && !loading && (
                    <p className="text-xs text-red-500 mt-1">
                        No {type} parent categories found. Create a parent category first.
                    </p>
                )}
            </div>

            <div className="pt-4">
                <SubmitButton loading={loading} label={category?.id ? "Update Subcategory" : "Create Subcategory"} />
            </div>
        </form>
    );
}