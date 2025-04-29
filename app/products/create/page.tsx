"use client";

import Input from "@/app/components/commons/Fields/Input";
import Select from "@/app/components/commons/Fields/Select";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { useState } from "react";

export default function CreateProduct() {
  const [content, setContent] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Product</h1>
      <div className="card w-full">
        <div className="p-4 space-y-4">
          {/* fields */}

          <Input
            label="Product name"
            id="title"
            type="text"
            placeholder="Product name"
            helpText=""
            showHelpText={true}
          />
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-200"
          >
            Product description
          </label>

          <TinyMCEEditor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            init={{
              height: 350,
              menubar: false,
              plugins: "link lists code",
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
            }}
            onEditorChange={(newValue) => setContent(newValue)}
          />
          <label
            htmlFor="feature"
            className="block text-sm font-medium text-gray-200"
          >
            Product features
          </label>

          <TinyMCEEditor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            init={{
              height: 250,
              menubar: false,
              plugins: "link lists code",
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
            }}
            onEditorChange={(newValue) => setContent(newValue)}
          />

          <Select
            label="Product category"
            options={["Category 1", "Category 2", "Category 3"]}
          />
        </div>
      </div>
    </div>
  );
}
