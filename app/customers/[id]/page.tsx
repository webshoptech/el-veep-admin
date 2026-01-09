"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserDetail } from "@/lib/api/users";
import { UserDetailResponse } from "@/types/UserType";
import UserOrders from "../components/UserOrders";
import ProfileCard from "../components/ProfileCard";

export default function UserDetail() {
    const params = useParams();
    const id = params?.id;
    const type = "customer";

    const [user, setUser] = useState<UserDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || typeof id !== "string") {
            setError("Invalid customer ID.");
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await getUserDetail(id, type);
                setUser(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load user details.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, type]);

    if (error) return <div className="text-green-500">{error}</div>;

    return (
        <div className="space-y-6">


            <ProfileCard user={user} loading={loading} />

            {typeof id === "string" && <UserOrders userId={id} type={type} />}

        </div>
    );
}
