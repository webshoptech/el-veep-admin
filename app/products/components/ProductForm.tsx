"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { addProduct, updateProduct } from "@/app/api_/products";
import { Product } from "@/types/ProductType";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import type { Editor as TinyMCEEditor } from "tinymce";


interface Props {
    onClose: () => void;
    product?: Product;
    onSuccess?: () => void;
}

export default function ProductForm({ onClose, product, onSuccess }: Props) {
    const [title, setTitle] = useState(product?.title || "");
    const [description, setDescription] = useState(product?.description || "");
    const [regularPrice, setRegularPrice] = useState(product?.regular_price || "");
    const [salesPrice, setSalesPrice] = useState(product?.sales_price || "");
    const [quantity, setQuantity] = useState(product?.quantity?.toString() || "");
    const [sku, setSku] = useState(product?.sku || "");
    const [skuManuallyEdited, setSkuManuallyEdited] = useState(false);
    const [status, setStatus] = useState<{ label: string; value: string } | null>(
        product?.status
            ? { label: product.status === "active" ? "Active" : "Inactive", value: product.status }
            : { label: "Active", value: "active" }
    );

    const [selectedCategory, setSelectedCategory] = useState<{ label: string; value: string } | null>(
        product?.category_id
            ? { label: product.category_name || "", value: String(product.category_id) }
            : null
    );


    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const categoryOptions = useMemo(() => {
        return categories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
        }));
    }, [categories]);

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ];

    const [loading, setLoading] = useState(false);

    const generateSKU = (title: string) => {
        const initials = title
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0].toUpperCase())
            .join("")
            .slice(0, 3);
        const randomNumber = Math.floor(100000 + Math.random() * 900000000);
        return `${initials}-${randomNumber}`.slice(0, 14).toUpperCase();
    };

    useEffect(() => {
        if (title && !skuManuallyEdited && !product?.id) {
            setSku(generateSKU(title));
        }
    }, [title, product?.id, skuManuallyEdited]);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = imageFiles.length + files.length;
        if (totalImages > 4) {
            toast.error("You can only upload up to 4 images");
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));

        setImageFiles((prev) => [...prev, ...files]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const editorRef = useRef<TinyMCEEditor | null>(null);

    useEffect(() => {
        if (product?.category_id && categories.length > 0) {
            const matchedCategory = categories.find(
                (cat) => String(cat.id) === String(product.category_id)
            );
            if (matchedCategory) {
                setSelectedCategory({
                    label: matchedCategory.name,
                    value: String(matchedCategory.id),
                });
            }
        }
    }, [categories, product?.category_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("regular_price", regularPrice.toString());
        formData.append("sales_price", salesPrice.toString());
        formData.append("quantity", quantity.toString());
        formData.append("sku", sku);
        formData.append("status", status?.value || "active");
        if (selectedCategory?.value) formData.append("category_id", selectedCategory.value);

        // images
        imageFiles.forEach((file) => {
            formData.append("images[]", file);
        });

        if (product?.id) formData.append("_method", "PUT");
        try {
            if (product?.id) {
                await updateProduct(product.id, formData);
                toast.success("Product updated successfully");
            } else {
                await addProduct(formData);
                toast.success("Product added successfully");
            }
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${product?.id ? "update" : "add"} product`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title <span className="text-green-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter product title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"

                />
            </div>

            {/* SKU */}
            <div hidden>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                    type="text"
                    readOnly={true}
                    placeholder="Auto-generated SKU"
                    value={sku}
                    onChange={(e) => {
                        setSku(e.target.value);
                        setSkuManuallyEdited(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {!skuManuallyEdited && (
                    <p className="text-xs text-gray-400 mt-1">
                        Auto-generated based on product title
                    </p>
                )}
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-green-500">*</span>
                </label>
                <SelectDropdown
                    options={categoryOptions}
                    value={selectedCategory || { label: "Select category", value: "" }}
                    onChange={(opt) => setSelectedCategory(opt)}
                    className="w-full"
                />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price (₦)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. 15000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (₦)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={salesPrice}
                        onChange={(e) => setSalesPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. 12000"
                    />
                </div>
            </div>

            {/* Quantity */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-green-500">*</span>
                </label>
                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 50"
                />
            </div>




            {/* Status */}
            <div hidden>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <SelectDropdown
                    options={statusOptions}
                    value={status || { label: "Select status", value: "" }}
                    onChange={(opt) => setStatus(opt)}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-green-500">*</span>
                </label>
                <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(_, editor) => (editorRef.current = editor)}
                    value={description}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            "advlist", "autolink", "lists", "link", "image",
                            "charmap", "preview", "anchor", "searchreplace",
                            "visualblocks", "code", "fullscreen",
                            "insertdatetime", "media", "table", "code", "help", "wordcount"
                        ],
                        toolbar:
                            "undo redo | formatselect | " +
                            "bold italic underline | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style:
                            "body { font-family:Inter,Arial,sans-serif; font-size:14px; color:#333; }",
                    }}
                    onEditorChange={(content) => setDescription(content)}
                />
            </div>


            {/* Product Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images <span className="text-green-500">*</span>
                </label>

                {/* Upload area — hidden if 4 images selected */}
                {imagePreviews.length < 4 && (
                    <label
                        htmlFor="productImages"
                        className="relative w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors p-6 flex flex-col items-center justify-center text-center text-green-600"
                    >
                        <svg
                            className="w-10 h-10 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
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
                        <span className="mt-2 text-sm text-gray-600">
                            Click to upload or drag and drop
                        </span>
                        <p className="text-xs text-gray-400">Max 4 images</p>

                        <input
                            id="productImages"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImagesChange}
                        />
                    </label>
                )}

                {/* Preview thumbnails */}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="object-cover w-full h-32 rounded-lg border border-gray-200 cursor-pointer"
                                />
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer flex items-center justify-center"
                                    title="Remove"
                                >
                                    <TrashIcon className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <SubmitButton loading={loading} label="Save Product" />
        </form>
    );
}