import { APP_NAME } from "@/app/setting";
import UsersTable from "./components/UsersTable";
export const generateMetadata = () => {

    return {
        title: "Customers - " + APP_NAME,
    };
};

export default function Customers() {
    return (
        <div className="space-y-2 text-gray-800">
            <h1 className="text-2xl font-bold">Customers</h1>
            <p>Manage your customers here.</p>
            <UsersTable limit={10} />
        </div>
    );
}
