'use client';

import ActivitiesTable from "@/app/customers/components/ActivitiesTable";

 
export default function Activities() { 
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Vendor Activities</h1>
            <p className="text-sm text-gray-500">Manage your vendor activities here.</p> 
            <ActivitiesTable limit={10} role="vendor" />
        </div>
    );
}