import { APP_NAME } from "../setting";
import OrdersTable from "./components/OrdersTable";

export const generateMetadata = () => {

    return {
        title: "Customers - " + APP_NAME,
    };
};
export default function Orders() {
    return (
        <div>
            <OrdersTable limit={10} />
        </div>
    );
}
