import { APP_NAME } from "../setting";
import ProductsTable from "./components/ProductsTable";

export const generateMetadata = () => {

  return {
    title: "Products - " + APP_NAME,
  };
}
export default function Products() {
  return (
    <div className="space-y-2 text-gray-800">
      <h1 className="text-2xl font-bold">Products</h1>
      <p>Manage your products here.</p>
      <ProductsTable limit={10} />
    </div>
  );
}