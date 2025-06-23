import { useState, useEffect } from "react";

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: {
    title?: string;
    author?: string;
    category?: string;
    description?: string;
    created_at?: string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const BlogForm = ({ mode, initialData = {}, onSubmit }: BlogFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    created_at: "",
    ...initialData,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
      created_at:
        mode === "create"
          ? new Date().toISOString()
          : initialData.created_at || "",
    }));
  }, [initialData, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        author: "",
        category: "",
        description: "",
        created_at: "",
      });
    } catch (err) {
      console.error("Form submit error:", err);
    }
  };

  return (
    <section
      id="blog-form"
      className="space-y-10 flex flex-col justify-between mx-auto px-[30px] lg:px-[0px]"
    >
      <h2 className="text-[22px] font-bold text-[#333333] text-left">
        {mode === "edit" ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 leading-relaxed overflow-hidden text-left md:text-justify"
      >
        {["title", "author", "category"].map((field) => (
          <div className="" key={field}>
            <label className="text-gray-400 block mb-2 font-semibold capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
        ))}

        <div className="">
          <label className="text-gray-400 block mb-2 font-semibold">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded bg-black text-white hover:bg-gray-800 transition"
          >
            {mode === "edit" ? "Update" : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BlogForm;
