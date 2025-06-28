import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import clsx from "clsx";
import { UserDetailResponse } from "@/types/UserType";

interface ProfileCardProps {
  user: UserDetailResponse | null;
  loading: boolean;
}

export default function ProfileCard({ user, loading }: ProfileCardProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Profile</h2>

      <div className="rounded-xl border border-amber-300 bg-white p-6 text-gray-700 shadow-md">
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton circle width={80} height={80} />
          ) : (
            <Image
              width={80}
              height={80}
              src={user?.profile_photo ?? "/placeholder.jpg"}
              alt={user?.name ?? "User"}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}

          <div>
            <h3 className="text-2xl font-bold">
              {loading ? <Skeleton width={150} /> : `${user?.name} ${user?.last_name}`}
            </h3>
            <p className="text-sm">{loading ? <Skeleton width={180} /> : user?.email}</p>
            <p className="text-sm">{loading ? <Skeleton width={140} /> : user?.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <span className="font-bold">Shipping address:</span>{" "}
            {loading ? (
              <Skeleton width={160} />
            ) : user?.address ? (
              [user.address.city, user.address.state, user.address.country]
                .filter(Boolean)
                .join(", ") || "Not provided"
            ) : (
              "Not provided"
            )}
          </div>

          <div>
            <span className="font-medium">Account Status:</span>{" "}
            {loading ? (
              <Skeleton width={80} />
            ) : (
              <span
                className={clsx(
                  "px-2 py-1 rounded text-sm",
                  user?.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}
              >
                {user?.is_active ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          <div>
            <span className="font-medium">Account Email:</span>{" "}
            {loading ? (
              <Skeleton width={90} />
            ) : (
              <span
                className={clsx(
                  "px-2 py-1 rounded text-sm",
                  user?.email_verified_at ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                )}
              >
                {user?.email_verified_at ? "Verified" : "Unverified"}
              </span>
            )}
          </div>

          <div>
            <span className="font-bold">Location:</span>{" "}
            {loading ? (
              <Skeleton width={120} />
            ) : (
              [user?.city, user?.state, user?.country]
                .filter(Boolean)
                .join(", ") || "Not provided"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
