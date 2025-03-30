import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Withdraws - " + APP_NAME,
    };
  };
  
  export default function Withdraws() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Withdraws</h1>
        <p>Manage your Withdraws here.</p>
      </div>
    );
  }
  