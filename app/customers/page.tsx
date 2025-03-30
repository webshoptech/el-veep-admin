import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Customers - " + APP_NAME,
    };
  };
  
  export default function Customers() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p>Manage your customers here.</p>
      </div>
    );
  }
  