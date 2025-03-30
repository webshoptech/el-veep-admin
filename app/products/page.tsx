import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Products - " + APP_NAME,
    };
  };
  
  export default function Products() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p>Manage your vendors products here.</p>
      </div>
    );
  }
  