import CategoriesTable from "./components/CategoriesTable";

export default function Categories() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-950">Categories</h1>
            <p className="text-sm text-gray-500 mb-6">Manage your categories here.</p>

            <CategoriesTable
                limit={10}
                type="products"
                status="active"
            />
        </div>
    );
}