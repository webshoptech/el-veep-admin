'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { useCategoryStore } from '@/app/store/CategoryStore';
import { addCategory, updateCategory } from '@/app/api_/categories';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { CategoryType } from '@/types/CategoryType';
import { fetchDescription } from '@/app/api_/ai_gemini';
import debounce from 'lodash.debounce';

interface Props {
  onClose: () => void;
  category?: CategoryType;
}

export default function CategoryForm({ onClose, category }: Props) {
  const [name, setName] = useState(category?.name || '');
  const [selectedParent, setSelectedParent] = useState<{ label: string; value: string } | null>(
    category?.parent_id
      ? { label: category.parent_name || '', value: String(category.parent_id) }
      : null
  );
  const [description, setDescription] = useState(category?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const { categories } = useCategoryStore();

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat.name,
      value: String(cat.id),
    }));
  }, [categories]);

  /** ✅ Stable debounced AI generation (no ESLint warning) */
  const debouncedGenerate = useRef(
    debounce(async (value: string) => {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= 3) {
        setIsGenerating(true);
        try {
          const res = await fetchDescription(value, 'category');
          if (res?.description) setDescription(res.description);
        } catch (error) {
          console.error('AI generation failed:', error);
        } finally {
          setIsGenerating(false);
        }
      }
    }, 1000)
  ).current;

  /** Cleanup debounce on unmount */
  useEffect(() => {
    return () => {
      debouncedGenerate.cancel();
    };
  }, [debouncedGenerate]);

  /** Handle input name changes */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    debouncedGenerate(value);
  };

  /** Handle image selection */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (selectedParent?.value) formData.append('parent_id', selectedParent.value);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (category?.id) {
        await updateCategory(category.id, formData);
        toast.success('Category updated successfully');
      } else {
        await addCategory(formData);
        toast.success('Category added successfully');
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${category?.id ? 'update' : 'add'} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Name */}
      <div className="relative">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="name"
            value={name}
            onChange={onInputChange}
            placeholder="Enter category name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {isGenerating && (
            <svg
              className="animate-spin h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
        </div>
      </div>

      {/* Parent Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Category <span className="text-green-500">(optional)</span>
        </label>
        <SelectDropdown
          options={categoryOptions}
          value={selectedParent || { label: 'Select category', value: '' }}
          onChange={(opt) => setSelectedParent(opt)}
          className="w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-green-500">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Category description"
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
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-green-600">
              <svg
                className="w-12 h-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="mt-2 text-sm">Click to upload or drag and drop</span>
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

      <SubmitButton loading={loading} label="Save changes" />
    </form>
  );
}
