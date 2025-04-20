"use client";

import React, { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { getPolicy, savePolicy } from "@/app/api";
import Toast from "@/app/components/commons/Toast";

interface PolicyEditorProps {
  type: string;
}

export default function PolicyEditor({ type }: PolicyEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await getPolicy(type);
        setContent(response?.data?.content || "");
      } catch (error) {
        console.error("Error fetching policy:", error);
      }
    };

    fetchPolicy();
  }, [type]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("content", content);

    try {
      const data = await savePolicy(formData);
      setToastMessage(data?.message || "Policy saved successfully!");
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
    <div className="p-0 space-y-2">
      <TinyMCEEditor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        init={{
          height: 500,
          menubar: false,
          plugins: "link lists code",
          toolbar:
            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
        }}
        onEditorChange={(newValue) => setContent(newValue)}
      />
      <div className="mt-8 border-t border-gray-200 pt-5">
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="bg-orange-600 inline-flex items-center cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-orange-700"
          >
            Save Policy
          </button>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        show={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
