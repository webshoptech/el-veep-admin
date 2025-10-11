'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgetPassword } from "../../api_/login";
import Image from "next/image";
import toast from "react-hot-toast";
import { SubmitButton } from "../../components/commons/SubmitButton";
import AuthHeader from "@/app/components/commons/AuthHeader";

type ErrorResponse = {
    message?: string;
    status?: string;
    error_detail?: string;
};

export default function ForgetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);

        try {
            setLoading(true);
            const result = await forgetPassword(formData);
            sessionStorage.setItem("resetEmail", email);

            toast.success(result.message || "Password reset link sent to your email.");
            router.replace("/auth/confirm-reset-code");

        } catch (err) {
            const error = err as { response?: { data?: ErrorResponse } };
            const errorDetail =
                error.response?.data?.error_detail ||
                error.response?.data?.message ||
                "Request failed";
            toast.error(errorDetail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthHeader title="Forgot Password" subtitle="Reset your password">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8 text-gray-500">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                        required
                    />
                </div>

                <SubmitButton label="Send Reset Link" loading={loading} />
            </form>
        </AuthHeader>
    );
}
