"use client";

import React, { useEffect, useState } from "react";
import Input from "@/app/components/commons/Fields/Input";
import Textarea from "@/app/components/commons/Fields/TextArea";
import Toast from "@/app/components/commons/Toast";
import { getAppSettings, saveAppSettings } from "@/app/api";
import Image from "next/image";
import { SubmitButton } from "@/app/components/commons/Buttons";

export default function AppSettings() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    app_name: "",
    app_logo: null,
    app_description: "",
    support_email: "",
    support_phone: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAppSettings();
         const data = response.data?.[0]; // Access the first (and likely only) item in the array
        if (!data) return;
        setFormData({
          app_name: data["app_name"] || "",
          app_logo: data["app_logo"] || "",
          app_description: data["app_description"] || "",
          support_email: data["support_email"] || "",
          support_phone: data["support_phone"] || "",
        });
        if (data["app_logo"]) {
          setImageUrl(data["app_logo"]);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };

    fetchSettings();
  }, []);

  const [imageUrl, setImageUrl] = useState("");
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();
 
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });

      const data = await saveAppSettings(payload);
 
      // Check if there's an error message from the API
      if (data?.error_detail) {
        setToastMessage(data.error_detail);
        setToastType("error");
        setToastOpen(true);
        return;
      }

      // Update form fields with successful response
      setFormData({
        app_name: data?.app_name || "",
        app_logo: data?.app_logo || "", // Optional: skip if it's a file
        app_description: data?.app_description || "",
        support_email: data?.support_email || "",
        support_phone: data?.support_phone || "",
      });

      setToastMessage(data?.message || "Settings saved successfully!");
      setToastType("success");
      setToastOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Submission error:", error);
      setToastMessage(
        error?.response?.data?.error_detail ||
          "Something went wrong while saving settings!"
      );
      setToastType("error");
      setToastOpen(true);
    }
  };

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        show={toastOpen}
        onClose={() => setToastOpen(false)}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <h1 className="text-2xl text-black font-semibold mb-4">Settings</h1>
        {imageUrl && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Current Logo Preview</p>
            <div className="flex justify-center">
              <Image
                width={150}
                height={40}
                src={imageUrl}
                alt="Current logo"
                priority
                className="w-37.5 h-10 rounded-md"
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Input
            type="text"
            label="Brand name"
            id="app_name"
            placeholder="Your brand name"
            value={formData["app_name"]}
            onChange={handleChange}
          />
          <Input
            type="file"
            label="Brand Logo"
            id="app_logo"
            placeholder="Your brand logo"
            onChange={handleChange}
          />
          <Textarea
            id="app_description"
            label="Brand description"
            maxLength={150}
            rows={5}
            value={formData["app_description"]}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="Support email address"
            id="support_email"
            placeholder="Your brand email"
            value={formData["support_email"]}
            onChange={handleChange}
          />
          <Input
            type="tel"
            label="Support phone number"
            id="support_phone"
            placeholder="Your brand phone"
            value={formData["support_phone"]}
            onChange={handleChange}
          />
        </div>

        <div className="mt-8 border-t border-gray-200 pt-5">
          <div className="flex justify-end space-x-3">
            <button
              type="reset"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() =>
                setFormData({
                  app_name: "",
                  app_logo: null,
                  app_description: "",
                  support_email: "",
                  support_phone: "",
                })
              }
            >
              Reset
            </button>
            <SubmitButton label="Save changes" />
          </div>
        </div>
      </form>
    </>
  );
}
