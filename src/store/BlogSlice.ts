import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/Supabase";

// --- Types ---
export interface BlogPost {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface BlogState {
  blogs: BlogPost[];
  loading: boolean;
  editBlog: BlogPost | null;
  hasMore: boolean;
}

// --- Initial State ---
const initialState: BlogState = {
  blogs: [],
  loading: false,
  editBlog: null,
  hasMore: false,

};

export const fetchBlogs = createAsyncThunk<
  { blogs: BlogPost[]; hasMore: boolean },
  number
>("blog/fetchAll", async (page) => {
  const limit = 4;
  const from = (page - 1) * limit;
  const to = from + limit;

  const { data, count, error } = await supabase
    .from("blog_list")
    .select("*", { count: "exact" }) 
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const hasMore = !!count && to + 1 < count;

  return { blogs: data as BlogPost[], hasMore };
});



export const deleteBlog = createAsyncThunk<
  number,
  { id: number; user_id: string }
>("blog/delete", async (blog) => {
  const { error } = await supabase
    .from("blog_list")
    .delete()
    .eq("id", blog.id)
    .eq("user_id", blog.user_id);

  if (error) throw error;
  return blog.id;
});


export const createBlog = createAsyncThunk(
  "blog/create",
  async (blogData: BlogPost) => {
    const { error } = await supabase.from("blog_list").insert([blogData]);
    if (error) throw error;
    return blogData;
  }
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async (blogData: BlogPost) => {
    const { error } = await supabase
      .from("blog_list")
      .update(blogData)
      .eq("id", blogData.id)
      .eq("user_id", blogData.user_id);

    if (error) throw error;
    return blogData;
  }
);


// --- Slice ---
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setEditBlog: (state, action: PayloadAction<BlogPost>) => {
      state.editBlog = action.payload;
    },
    clearEditBlog: (state) => {
      state.editBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
  state.blogs = action.payload.blogs;
  state.loading = false;
  state.hasMore = action.payload.hasMore; 
})

      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<number>) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      });
  },
});

// --- Exports ---
export const { setEditBlog, clearEditBlog } = blogSlice.actions;
export default blogSlice.reducer;
