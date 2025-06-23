import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBlogs,
  deleteBlog,
  setEditBlog,
  clearEditBlog,
  createBlog,
  updateBlog,
} from "../store/BlogSlice";
import type { RootState, AppDispatch } from "../store/store";
import {
  setMode,
  setToastMode,
  setShowCreate,
  setShowSuccess,
  setVisible,
} from "../store/uiSlice";
import type { BlogPost } from "../store/BlogSlice";
import { supabase } from "../utils/Supabase";

const Admin = () => {
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();

  const { blogs, loading, editBlog, hasMore } = useSelector(
    (state: RootState) => state.blog
  );

  const { mode, toastMode, showCreate, showSuccess, visible } = useSelector(
    (state: RootState) => state.ui
  );

  useEffect(() => {
    dispatch(fetchBlogs(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (showSuccess) {
      dispatch(setVisible(true));
      const hideTimer = setTimeout(() => dispatch(setVisible(false)), 3000);
      const removeTimer = setTimeout(
        () => dispatch(setShowSuccess(false)),
        3500
      );
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showSuccess, dispatch]);

  const handleDelete = async (blog: { id: number; user_id: string }) => {
    await dispatch(deleteBlog(blog));
    dispatch(setToastMode("delete"));
    dispatch(setShowSuccess(true));

    // Pull back a page if no more blogs left on current one
    const remainingBlogs = blogs.length;
    if (remainingBlogs === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      dispatch(fetchBlogs(page)); // refresh current page
    }
  };

  const handleEdit = (id: number) => {
    const blog = blogs.find((b) => b.id === id);
    if (blog) {
      dispatch(setShowCreate(null));
      setTimeout(() => {
        dispatch(setEditBlog(blog));
        dispatch(setMode("edit"));
        dispatch(setShowCreate("side"));
      });
    }
  };

  const handleSubmit = async (_data: any) => {
    if (editBlog) {
      await dispatch(updateBlog({ ...editBlog, ..._data }));
      dispatch(setToastMode("edit"));
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user_id = session?.user.id;
      await dispatch(createBlog({ ..._data, user_id }));
      dispatch(setToastMode("create"));
    }

    dispatch(setShowCreate(null));
    dispatch(setShowSuccess(true));
    dispatch(clearEditBlog());
    dispatch(setMode("create"));

    setTimeout(() => dispatch(fetchBlogs(page)), 300);
    setPage(1);
  };

  return (
    <>
      <Navbar
        mode={mode}
        editBlog={editBlog}
        onSubmitBlog={handleSubmit}
        onCancel={() => {
          dispatch(clearEditBlog());
          dispatch(setMode("create"));
        }}
        showCreate={showCreate}
        setShowCreate={(val) =>
          dispatch(setShowCreate(typeof val === "function" ? val(null) : val))
        }
        setEditBlog={(blog) => dispatch(setEditBlog(blog as BlogPost))}
        setMode={(val) => dispatch(setMode(val as "create" | "edit"))}
        setToastMode={(val) =>
          dispatch(setToastMode(val as "create" | "edit" | "delete"))
        }
      />

      <div className="min-h-screen flex flex-col p-6 max-w-6xl mx-auto pt-16">
        <h2 className="mb-4">Blog Posts</h2>

        {showSuccess && (
          <div
            className={`fixed top-5 right-5 transform z-80 transition-all duration-500 ease-out ${
              visible
                ? "translate-y-0 opacity-100 z-80"
                : "-translate-y-full opacity-0 z-70"
            }`}
          >
            <div className="text-sm bg-[#16171B] border border-gray-600 text-white px-8 py-4 rounded-xl shadow-lg flex flex-row justify-center items-start gap-3">
              <i className="fa-solid fa-circle-check mt-[1.5px] text-[17px] text-green-400"></i>
              <p className="flex justify-center">
                <span className="mb-1 items-start">
                  {toastMode === "edit"
                    ? "Blog Modified Successfully!"
                    : toastMode === "delete"
                    ? "Blog Deleted Successfully!"
                    : "Blog Submitted Successfully!"}
                </span>
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="text-center w-full max-w-2xl mx-auto font-normal py-10 border rounded-lg border-[#E0E0E0]">
            This table is empty.
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="w-full flex flex-row rounded-md shadow-lg border border-gray-200"
                >
                  <div className="flex flex-col space-y-3 p-4 w-full">
                    <div className="flex items-center justify-between">
                      <p>{blog.title}</p>
                      <div className="flex gap-5">
                        <button
                          className="cursor-pointer"
                          onClick={() => handleEdit(blog.id)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleDelete(blog)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="font-normal">by {blog.author}</p>
                    <div className="flex justify-start">
                      <p className="bg-gray-900 px-4 py-2 rounded-2xl text-[12px] text-white">
                        {blog.category}
                      </p>
                    </div>
                    <div className="text-gray-500 font-normal">
                      {blog.description}
                    </div>
                    <div className="flex justify-end text-[#6C6C72] text-xs">
                      <div className="bg-[#f3f3f3] p-3 rounded-md">
                        {new Date(blog.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center gap-4 mt-10">
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="text-sm font-medium">Page {page}</span>
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
