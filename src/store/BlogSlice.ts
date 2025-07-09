// features/user/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  description: string;
  created_at: string;
  user_id: string;
  email: string;
}


interface BlogState {
  blogs: BlogPost[];
  mode: "create" | "edit" | "delete" | null;
  loading: boolean;
  editBlog: BlogPost | null;
  deleteBlog: BlogPost | null;
  blogSubmitted: boolean;
}

const initialState: BlogState = {
  blogs: [],
  mode: null,
  loading: false,
  editBlog: null,
  deleteBlog: null,
  blogSubmitted: false,
};

const userSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    createBlog: (state) => {
      state.mode = "create";
    },
    editBlog: (state, action: PayloadAction<BlogPost>) => {
      state.mode = "edit";
      state.editBlog = action.payload;
    },
    deleteBlog: (state, action: PayloadAction<BlogPost>) => {
      state.mode = "delete";
      state.deleteBlog = action.payload;
    },
   submitBlog(state) {
      state.blogSubmitted = !state.blogSubmitted; // toggle to trigger useEffect
      state.mode = null; // close panel after submission
      state.editBlog = null;
      state.deleteBlog = null;
    },
    setMode: (state, action: PayloadAction<"create" | "edit" | null>) => {
      state.mode = action.payload;
    }, 
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }, 
    setBlogs: (state, action: PayloadAction<BlogPost[]>) => {
      state.blogs = action.payload;
    },
}
});

export const { createBlog, editBlog, deleteBlog, submitBlog, setMode, setLoading, setBlogs } = userSlice.actions;
export default userSlice.reducer;
