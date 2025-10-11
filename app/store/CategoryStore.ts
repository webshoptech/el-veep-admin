import { create } from "zustand";
import { getCategories } from "../api_/categories";

interface Category {
    id: number;
    name: string;
    type: string;
    image?: string;
    description?: string;
    status?: string;
    parent_id?: number | null;
    created_at?: string;
    updated_at?: string;
    children?: Category[];
}

interface CategoryStore {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    clearCategories: () => void;
    fetchCategories: (force?: boolean) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],

    setCategories: (categories) => set({ categories }),

    addCategory: (category) =>
        set((state) => ({ categories: [category, ...state.categories] })),

    clearCategories: () => set({ categories: [] }),

    fetchCategories: async (force = false) => {
        const { categories } = get();

        // Avoid refetching unless forced or empty
        if (categories.length > 0 && !force) return;

        try {
            const response = await getCategories();
            if (
                response?.status === "success" &&
                Array.isArray(response.data)
            ) {
                set({ categories: response.data });
            } else {
                console.error("Invalid category response format:", response);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    },
}));
