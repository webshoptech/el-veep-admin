"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import Input from "@/app/components/commons/Fields/Input";
import Textarea from "@/app/components/commons/Fields/TextArea";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import Skeleton from 'react-loading-skeleton'
import { getAppSettings, saveAppSettings } from "@/app/api";
import toast from "react-hot-toast";

interface AppSettingsData {
    app_name: string;
    app_logo: File | string | null;
    app_description: string;
    support_email: string;
    support_phone: string;
}

const initialData: AppSettingsData = {
    app_name: "",
    app_logo: null,
    app_description: "",
    support_email: "",
    support_phone: "",
};

const useAppSettingsForm = () => {
    const [originalSettings, setOriginalSettings] = useState<AppSettingsData>(initialData);
    const [values, setValues] = useState<AppSettingsData>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await getAppSettings();
                const data = response.data?.[0];
                if (data) {
                    const settings = {
                        app_name: data.app_name || "",
                        app_logo: data.app_logo || null,
                        app_description: data.app_description || "",
                        support_email: data.support_email || "",
                        support_phone: data.support_phone || "",
                    };
                    setValues(settings);
                    setOriginalSettings(settings)
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast.error("Could not load app settings.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const logoPreviewUrl = useMemo(() => {
        if (values.app_logo instanceof File) {
            return URL.createObjectURL(values.app_logo);
        }
        return values.app_logo as string | null;
    }, [values.app_logo]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setValues((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValues((prev) => ({ ...prev, app_logo: file }));
        }
    }, []);

    const handleReset = useCallback(() => {
        setValues(originalSettings);
    }, [originalSettings]);

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'app_logo') {
                if (value instanceof File) {
                    payload.append(key, value);
                }
            } else if (value !== null && value !== undefined) {
                payload.append(key, value as string);
            }
        });

        try {
            const data = await saveAppSettings(payload);
            if (data?.error_detail) {
                toast.error(data.error_detail);
                return;
            }

            // Re-sync the state with the response from the server
            const updatedSettings = {
                app_name: data.app_name || "",
                app_logo: data.app_logo || null,
                app_description: data.app_description || "",
                support_email: data.support_email || "",
                support_phone: data.support_phone || "",
            };
            setValues(updatedSettings);
            setOriginalSettings(updatedSettings);

            toast.success("Settings saved successfully!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error_detail?: string } } };
            console.error("Submission error:", err);
            toast.error(err?.response?.data?.error_detail || "Failed to save settings.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        values,
        isLoading,
        isSubmitting,
        logoPreviewUrl,
        handleChange,
        handleFileChange,
        handleSubmit,
        handleReset,
    };
};
export default function AppSettings() {
    const {
        values,
        isLoading,
        isSubmitting,
        logoPreviewUrl,
        handleChange,
        handleFileChange,
        handleSubmit,
        handleReset,
    } = useAppSettingsForm();

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (isLoading) {
        return <Skeleton count={5} />;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl text-black font-semibold mb-6">App Settings</h1>

            {/* Logo Section */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
                {logoPreviewUrl && (
                    <div className="mb-4 md:mb-0">
                        <Image
                            width={120}
                            height={40}
                            src={logoPreviewUrl}
                            alt="App logo preview"
                            priority
                            className="rounded-xl border p-1 bg-gray-50 object-contain"
                        />
                    </div>
                )}
                <div>
                    <input
                        type="file"
                        id="app_logo"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="hidden"
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        Change Logo
                    </button>
                </div>
            </div>

            {/* Form Inputs */}
            <fieldset disabled={isSubmitting} className="space-y-6">
                <Input
                    label="Brand name"
                    id="app_name"
                    value={values.app_name}
                    onChange={handleChange}
                />
                <Textarea
                    label="Brand description"
                    id="app_description"
                    maxLength={150}
                    rows={5}
                    value={values.app_description}
                    onChange={handleChange}
                />
                <Input
                    label="Support email address"
                    id="support_email"
                    type="email"
                    value={values.support_email}
                    onChange={handleChange}
                />
                <Input
                    label="Support phone number"
                    id="support_phone"
                    type="tel"
                    value={values.support_phone}
                    onChange={handleChange}
                />
            </fieldset>

            {/* Actions */}
            <div className="mt-8 border-t border-gray-200 pt-5 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-200"
                >
                    Reset
                </button>
                <SubmitButton label="Save changes" loading={isSubmitting} />
            </div>
        </form>
    );
}