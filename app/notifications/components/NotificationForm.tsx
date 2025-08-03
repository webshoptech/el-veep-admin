'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { sendNotification } from '@/app/api_/notifications';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';

interface NotificationData {
    id: string;
    receiver: string;
    body: string;
    image: string;
    cta: string;
}

interface Props {
    onClose: () => void;
    notification?: NotificationData;
}
type Option = { label: string; value: string };

const receiverOptions: Option[] = [
    { label: 'All', value: 'all' },
    { label: 'Vendor', value: 'vendor' },
    { label: 'Customer', value: 'customer' },
];

export default function NotificationForm({ onClose, notification }: Props) {
    const [body, setBody] = useState('');
    const [cta, setCta] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [receiver, setReceiver] = useState<Option>({ label: 'Select receiver', value: '' });


    useEffect(() => {
        if (notification) {
            const matched = receiverOptions.find(opt => opt.value === notification.receiver);
            if (matched) setReceiver(matched);

            setBody(notification.body);
            setCta(notification.cta);
            setImagePreview(notification.image);
        }
    }, [notification]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('receiver', receiver.value);
            formData.append('body', body);
            formData.append('cta', cta);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            await sendNotification(formData);
            toast.success('Notification sent successfully!');

            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to send notification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Receiver */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={receiverOptions}
                    value={receiver}
                    onChange={setReceiver}
                    className="w-full"
                />
            </div>

            {/* Body */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Body <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Type your notification message here"
                />
            </div>

            {/* CTA */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call to Action (CTA) Link
                </label>
                <input
                    type="text"
                    placeholder="https://example.com"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image <span className="text-red-500">*</span>
                </label>
                <label
                    htmlFor="notificationImage"
                    className="relative w-full h-50 aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors overflow-hidden flex items-center justify-center"
                >
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-orange-600">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-sm">Click to upload or drag and drop</span>
                        </div>
                    )}
                    <input
                        id="notificationImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>

            <SubmitButton loading={loading} label={notification ? 'Update Notification' : 'Send Notification'} />
        </form>
    );
}
