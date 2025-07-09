import React, { useState, useEffect } from "react";
import { supabase } from "../utils/Supabase";
import { useDispatch, useSelector } from "react-redux";
import { submitBlog } from "../store/BlogSlice";
import type { RootState } from "../store/store";

interface BlogFormProps {
  mode: "create" | "edit" | "delete";
}

const BlogForm: React.FC<BlogFormProps> = ({ mode }) => {
  const dispatch = useDispatch();
  const editBlog = useSelector((state: RootState) => state.blog.editBlog);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Prefill form fields when editing
  useEffect(() => {
    if (mode === "edit" && editBlog) {
      setTitle(editBlog.title);
      setDescription(editBlog.description);
      setCategory(editBlog.category);
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
    }
  }, [mode, editBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;

    if (mode === "edit" && editBlog) {
      // ✏️ UPDATE logic
      const { data, error } = await supabase
        .from("blog_list")
        .update({
          title,
          description,
          category,
        })
        .eq("id", editBlog.id);

      if (error) {
        console.error("Update error:", error.message);
      } else {
        console.log("Update success:", data);
        dispatch(submitBlog());
      }
    } else {
      const { data, error } = await supabase.from("blog_list").insert([
        {
          title,
          category,
          description,
          user_id: user?.id,
          email: user?.email,
        },
      ]);

      if (error) {
        console.error("Insert error:", error.message);
      } else {
        console.log("Insert success:", data);
        dispatch(submitBlog());
      }
    }

    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "Create New Blog" : "Edit Blog"}
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full h-40 border p-2 rounded"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full border p-2 rounded text-gray-500"
        required
      >
        <option value="" disabled>
          Feelings
        </option>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="anger">Anger</option>
        <option value="fear">Fear</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {mode === "create" ? "Publish" : "Update"}
      </button>
    </form>
  );
};

export default BlogForm;
