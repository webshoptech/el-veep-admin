"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { addCategory, updateCategory } from "@/lib/api/categories";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { CategoryType } from "@/types/CategoryType";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";
import { TYPES } from "@/setting";

interface Props {
    onClose: () => void;
    category?: CategoryType;
}

export default function CategoryForm({ onClose, category }: Props) {
    const [name, setName] = useState(category?.name || "");
    const [type, setType] = useState<"products" | "services">(
        category?.type || "products",
    );
    const [selectedParent, setSelectedParent] = useState<{
        label: string;
        value: string;
    } | null>(
        category?.parent_id
            ? {
                  label: category.parent_name || "",
                  value: String(category.parent_id),
              }
            : null,
    );
    const [description, setDescription] = useState(category?.description || "");
    const [imagePreview, setImagePreview] = useState<string | null>(
        category?.image || null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { categories } = useCategoryStore();
    const editorRef = useRef<TinyMCEEditor | null>(null);

    // Find current type object for the dropdown
    const selectedType = TYPES.find((opt) => opt.value === type) || TYPES[0];

    const categoryOptions = useMemo(() => {
        return categories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
        }));
    }, [categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type); // Append the type to FormData
        formData.append("description", description);
        if (selectedParent?.value)
            formData.append("parent_id", selectedParent.value);
        if (imageFile) formData.append("image", imageFile);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success("Category updated successfully");
            } else {
                await addCategory(formData);
                toast.success("Category added successfully");
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${category?.id ? "update" : "add"} category`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection Section */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Type <span className="text-green-500">*</span>
                </label>
                <SelectDropdown
                    options={TYPES}
                    value={selectedType}
                    onChange={(opt) =>
                        setType(opt.value as "products" | "services")
                    }
                    className="w-full"
                />
            </div>

            {/* Category Name */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name <span className="text-green-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
            </div>

            {/* Parent Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category{" "}
                    <span className="text-green-500">(optional)</span>
                </label>
                <SelectDropdown
                    options={categoryOptions}
                    value={
                        selectedParent || {
                            label: "Select category",
                            value: "",
                        }
                    }
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                />
            </div>
 
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Description <span className="text-green-500">*</span>
                </label>
                <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this category..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
            </div>

            {/* Category Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cat Image <span className="text-green-500">*</span>
                </label>
                <label
                    htmlFor="categoryImage"
                    className="relative w-full h-50 aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors overflow-hidden flex items-center justify-center"
                >
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-green-600">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="mt-2 text-sm">
                                Click to upload or drag and drop
                            </span>
                        </div>
                    )}
                    <input
                        id="categoryImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>

            <SubmitButton
                loading={loading}
                label={category?.id ? "Update category" : "Save category"}
            />
        </form>
    );
}
