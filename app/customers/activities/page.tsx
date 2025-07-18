'use client';
import ActivitiesTable from "../components/ActivitiesTable";

 
export default function Activities() { 
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer Activities</h1>
            <p className="text-sm text-gray-500">Manage your customer activities here.</p> 
            <ActivitiesTable limit={10} role="customer" />
        </div>
    );
}