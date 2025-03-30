import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Vendors - " + APP_NAME,
    };
  };
  
  export default function Vendor() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Vendors</h1>
        <p>Manage your vendors here.</p>
      </div>
    );
  }
  