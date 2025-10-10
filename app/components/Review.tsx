"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReviewType from "@/types/ReviewType";
import { formatHumanReadableDate } from "../../utils/formatHumanReadableDate";
import RecentReviewsSkeleton from "./Skeletons/RecentReviewsSkeleton";
import { listReviews } from "../api_/reviews";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-4 h-4 ${index < rating ? "text-green-400" : "text-gray-400"
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: ReviewType }) {
    return (
        <div className="flex items-start space-x-4 py-4">
            <Image
                src={
                    review.user?.profile_photo ||
                    "https://via.placeholder.com/40?text=No+Image"
                }
                alt={review.user?.name || "Anonymous"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white truncate">
                        {review.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {formatHumanReadableDate(review.created_at)}
                    </p>{" "}
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-1 text-sm text-gray-500 truncate w-56">
                    {review.comment}
                </p>
            </div>
        </div>
    );
}

export function RecentReviews() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await listReviews(3, 0);
                if (response?.status === "success" && Array.isArray(response.data)) {
                    setReviews(response.data);
                } else {
                    setError("Failed to fetch reviews");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching reviews");
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    if (loading) {
        return <RecentReviewsSkeleton />;
    }

    if (error) {
        return <p className="text-green-500">{error}</p>;
    }

    return (
        <div className="mb-4">
            {/* Header row */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold text-gray-900">Recent Reviews</p>
                <Link
                    href="/reviews"
                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-green-50 py-2 px-4 rounded"
                >
                    See all
                </Link>
            </div>

            {/* Reviews list */}
            <div className="divide-y divide-white/10">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="cursor-pointer hover:bg-hub-secondary-50/50 rounded-lg p-1"
                    >
                        <ReviewCard review={review} />
                    </div>
                ))}
            </div>
        </div>
    );

}
