'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api_/login";
import Image from "next/image";
import toast from "react-hot-toast";


type LoginErrorResponse = {
    message?: string;
    status?: string;
    error_detail?: string;
};
export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const result = await login(formData);
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.data));

            if (result?.must_change_password === true) {
                toast.error("Please change your password");
                router.push("/change-password");
            } else {
                toast.success("Login successful");
                router.push("/");
            }
        } catch (err) {
            const error = err as { response?: { data?: LoginErrorResponse } };

            const errorDetail =
                error.response?.data?.error_detail ||
                error.response?.data?.message ||
                "Login failed";

            toast.error(errorDetail);
        }
    };


    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login.png')" }}></div>

            <div className="w-1/2 flex flex-col justify-center items-center px-8">
                <Image width={200} height={200} src="/logo.png" alt="Logo" className="mb-10" />

                <h1 className="text-2xl font-bold mb-6">Administration</h1>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email Address"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your Password"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                        />
                        <div className="text-right mt-1">
                            <a href="#" className="text-sm text-orange-500 hover:underline">Forgot Password?</a>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600 transition">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}