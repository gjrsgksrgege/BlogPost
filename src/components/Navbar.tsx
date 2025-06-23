import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/Supabase";
import BlogForm from "../components/BlogForm";

interface BlogPost {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface NavbarProps {
  mode: "create" | "edit";
  editBlog: BlogPost | null;
  onSubmitBlog: (data: any) => void;
  onCancel: () => void;
  showCreate: "side" | null;
  setShowCreate: React.Dispatch<React.SetStateAction<"side" | null>>;
  setEditBlog: (blog: BlogPost | null) => void;
  setMode: React.Dispatch<React.SetStateAction<"create" | "edit">>;
  setToastMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete">
  >;
}

const Navbar = ({
  mode,
  editBlog,
  onSubmitBlog,
  onCancel,
  showCreate,
  setShowCreate,
  setEditBlog,
  setMode,
  setToastMode,
}: NavbarProps) => {
  const [showProfile, setShowProfile] = useState<"side" | null>(null);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);
  const sideCreatePanelRef = useRef<HTMLDivElement | null>(null);
  const sideCreate2PanelRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedOutsideProfile =
        !sidePanelRef.current?.contains(target) &&
        !profileRef.current?.contains(target);

      const clickedOutsideCreate =
        !sideCreatePanelRef.current?.contains(target) &&
        !sideCreate2PanelRef.current?.contains(target);

      if (clickedOutsideProfile) setShowProfile(null);
      if (clickedOutsideCreate) setShowCreate(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-80 bg-[#fff] border border-[#E0E0E0]">
        <nav className="grid md:grid-cols-2 items-center px-8 w-full h-full gap-4 relative">
          <div className="uppercase tracking-widest cursor-pointer">Logo</div>

          <div className="justify-self-end relative">
            <div className="flex items-center">
              {/* Create Blog Button */}
              <div
                ref={sideCreatePanelRef}
                className="border border-[#E0E0E0] bg rounded-4xl"
              >
                <button
                  className="px-3 py-2 rounded cursor-pointer hover:rounded-full hover:text-white hover:bg-black transition-all flex items-center gap-2 text-xs font-[500]"
                  onClick={() => {
                    setShowCreate(null);
                    setTimeout(() => {
                      setEditBlog(null);
                      setMode("create");
                      setToastMode("create");
                      setShowCreate("side");
                    }, 300);
                  }}
                >
                  <div className="flex items-center">
                    <i className="fa-regular fa-plus text-[10px]"></i>
                  </div>
                  <p>Create Blog</p>
                </button>
              </div>

              {/* Profile Button */}
              <div ref={sidePanelRef}>
                <button
                  className="px-4 py-3 cursor-pointer rounded transition-all"
                  onClick={() =>
                    setShowProfile(showProfile === "side" ? null : "side")
                  }
                >
                  <i className="fa-regular fa-user"></i>
                </button>
              </div>

              {/* Mobile Menu (hamburger) */}
              <div className="block md:hidden">
                <button className="block md:hidden">
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Background Overlay */}
      {showCreate && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-200/50 backdrop-blur-sm z-80"></div>
      )}

      {/* Profile Dropdown Panel */}
      <div
        ref={profileRef}
        className={`fixed right-0 top-[35px] w-[250px] bg-[#fff] z-50 border py-4 border-[#E0E0E0] shadow-md transform transition-all duration-300 ease-out ${
          showProfile ? "translate-y-0 z-60" : "-translate-y-full z-50"
        }`}
      >
        <ul className="flex flex-col text-sm font-normal">
          <li className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer">
            My Account
          </li>
          <li className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer">
            Settings
          </li>
          <li
            className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Create Blog Panel */}
      <div
        ref={sideCreate2PanelRef}
        className={`fixed top-0 right-0 left-0 max-w-xl px-12 py-10 h-screen bg-white border border-[#E0E0E0] transform transition-all duration-300 ease-out ${
          showCreate ? "translate-x-0 z-90" : "-translate-x-full z-80"
        }`}
      >
        <div className="w-full">
          <BlogForm
            mode={mode}
            initialData={editBlog || {}}
            onSubmit={(data) => {
              onSubmitBlog(data);
            }}
            onCancel={onCancel}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
