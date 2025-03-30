import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Orders - " + APP_NAME,
    };
  };
  
  export default function Orders() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p>Manage your vendors orders here.</p>
      </div>
    );
  }
  