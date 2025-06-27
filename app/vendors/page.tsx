import { APP_NAME } from "@/app/setting";
import UsersTable from "./components/page";
export const generateMetadata = () => {

    return {
      title: "Vendors - " + APP_NAME,
    };
  };
  
  export default function Vendor() {
    return (
      <div className="space-y-2 text-gray-800">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <p>Manage your vendors here.</p>
        <UsersTable limit={10} />
      </div>
    );
  }
  