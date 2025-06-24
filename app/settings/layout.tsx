import SettingsSidebar from "./SettingsSidebar";
import { Toaster } from "react-hot-toast";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-white rounded-xl">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsSidebar />
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
      <Toaster/> 
    </div>
  );
}
