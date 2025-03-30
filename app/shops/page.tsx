import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Shops - " + APP_NAME,
    };
  };
  
  export default function Shops() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Shops</h1>
        <p>Manage your vendor shops here.</p>
      </div>
    );
  }
  