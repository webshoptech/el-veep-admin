"use client";
import BasicInfoFields from "./fields/BasicInfoFields";
import CategoryFields from "./fields/CategoryFields";
import PriceFields from "./fields/PriceFields";
import ProductDimensionFields from "./fields/ProductDimensionFields";
import ServiceFields from "./fields/ServiceFields";
import ImageUploader from "./fields/ImageUploader";
import { useItemForm } from "@/hooks/useItemForm";
import { SubmitButton as OriginalSubmitButton } from "../../components/commons/SubmitButton";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { useState } from "react";

interface Props {
    onClose: () => void;
    item?: any;
}

const typeOptions = [
    { label: "Physical Product", value: "products" },
    { label: "Service / Digital", value: "services" },
];

export default function ItemForm({ onClose, item }: Props) {
    const form = useItemForm(item);
    const selectedType = typeOptions.find(opt => opt.value === form.shopType) || typeOptions[0];

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onClose);
            }}
            className="space-y-6 text-gray-800"
        >
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-semibold text-green-800 mb-2">
                    What are you adding?
                </label>
                <SelectDropdown
                    options={typeOptions}
                    value={selectedType} 
                    onChange={(opt) => form.setShopType(opt.value)}
                    className="w-full"
                />
                <p className="text-xs text-green-600 mt-2">
                    Choosing {form.shopType === 'products' ? 'Product' : 'Service'} will update the fields below.
                </p>
            </div>

            <BasicInfoFields
                title={form.title}
                setTitle={form.setTitle}
                description={form.description}
                setDescription={form.setDescription} 
            />

            <CategoryFields
                categories={form.categories}
                selectedCategory={form.selectedCategory}
                setSelectedCategory={form.setSelectedCategory}
                selectedChildCategory={form.selectedChildCategory}
                setSelectedChildCategory={form.setSelectedChildCategory}
            />

            <PriceFields
                salesPrice={form.salesPrice}
                setSalesPrice={form.setSalesPrice}
                regularPrice={form.regularPrice}
                setRegularPrice={form.setRegularPrice}
                quantity={form.quantity}
                setQuantity={form.setQuantity}
                shopType={form.shopType}
            />

            {/* {form.shopType === "products" && (
                <ProductDimensionFields
                    weight={form.weight}
                    setWeight={form.setWeight}
                    weightUnit={form.weightUnit}
                    setWeightUnit={form.setWeightUnit}
                    lengthVal={form.lengthVal}
                    setLengthVal={form.setLengthVal}
                    widthVal={form.widthVal}
                    setWidthVal={form.setWidthVal}
                    heightVal={form.heightVal}
                    setHeightVal={form.setHeightVal}
                    sizeUnit={form.sizeUnit}
                    setSizeUnit={form.setSizeUnit}
                />
            )} */}

            {form.shopType === "services" && (
                <ServiceFields
                    pricingModel={form.pricingModel}
                    setPricingModel={form.setPricingModel}
                    deliveryMethod={form.deliveryMethod}
                    setDeliveryMethod={form.setDeliveryMethod}
                    estimatedDeliveryTime={form.estimatedDeliveryTime}
                    setEstimatedDeliveryTime={form.setEstimatedDeliveryTime}
                    availableDays={form.availableDays}
                    setAvailableDays={form.setAvailableDays}
                    availableFrom={form.availableFrom}
                    setAvailableFrom={form.setAvailableFrom}
                    availableTo={form.availableTo}
                    setAvailableTo={form.setAvailableTo}
                    dayOptions={form.dayOptions}
                />
            )}

            <ImageUploader
                existingImages={form.existingImages}
                newPreviews={form.newPreviews}
                handleImagesChange={form.handleImagesChange}
                removeExistingImage={form.removeExistingImage}
                removeNewImage={form.removeNewImage}
                itemId={form.itemId}
            />

            <div className="pt-4">
                <OriginalSubmitButton
                    loading={form.loading}
                    label={item?.id ? "Update item" : "Save changes"}
                />
            </div>
        </form>
    );
}