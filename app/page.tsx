import { APP_NAME } from "@/app/setting";
export const generateMetadata = () => {

    return {
      title: "Dashboard - " + APP_NAME,
    };
  };
  
  export default function Home() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Homepage</h1>
        <p>Manage your vendors orders here.</p>
      </div>
    );
  }
  