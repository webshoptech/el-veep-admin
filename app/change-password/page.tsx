'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "../api_/login";
import Image from "next/image";
import toast from "react-hot-toast";

type LoginErrorResponse = {
  message?: string;
  status?: string;
  error_detail?: string;
};

export default function ChangePassword() {
  const router = useRouter();
  const [new_password, setNewPassword] = useState("");
  const [current_password, setCurrentPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("new_password", new_password);
    formData.append("current_password", current_password);

    try {
      const result = await changePassword(formData); 
      toast.success(result.message);
      router.push("/");
    } catch (err) {
      const error = err as { response?: { data?: LoginErrorResponse } };

      const errorDetail =
        error.response?.data?.error_detail ||
        error.response?.data?.message ||
        "Password change failed";

      toast.error(errorDetail);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login.png')" }}></div>

      <div className="w-1/2 flex flex-col justify-center items-center px-8">
        <Image width={200} height={200} src="/logo.png" alt="Logo" className="mb-10" />

        <h1 className="text-2xl font-bold mb-6">Change Password</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
          <div>
            <label className="block text-sm font-medium mb-1">Temporary Password</label>
            <input
              type="password"
              value={current_password}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
