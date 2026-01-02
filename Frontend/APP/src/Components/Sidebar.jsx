import axios from "axios";
import toast from "react-hot-toast";
import {
    Heart,
    Home,
    Instagram,
    LogOut,
    MessageCircle,
    Plus,
    Search,
    TrendingUp,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const sidebarItems = [
        { icon: <Home size={24} />, text: "Home", link: "/" },
        { icon: <Search size={24} />, text: "Search" },
        { icon: <TrendingUp size={24} />, text: "Explore" },
        { icon: <MessageCircle size={24} />, text: "Messages", link: "/messages" },
        { icon: <Heart size={24} />, text: "Notifications" },
        { icon: <Plus size={24} />, text: "Create" },
        { icon: <User size={24} />, text: "Profile" },
        { icon: <LogOut size={24} />, text: "Logout" },
    ];

    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Logout successful");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Logout failed");
            console.error(error);
        }
    };

    const sidebarHandler = (text) => {
        if (text === "Logout") {
            logoutHandler();
        } else if (text === "Create") {
            navigate("/AddPost");
        } else if (text === "Messages") {
            navigate("/message");
        } else if (text === "Home") {
            navigate("/");
        }
        // Add other navigations here as needed
    };

    return (
        <aside className="h-screen fixed left-0 top-0 w-16 md:w-64 border-r bg-white flex flex-col justify-between z-50 transition-all duration-300">
            <div>
                {/* Logo Section */}
                <div className="flex items-center justify-center md:justify-start px-4 py-8 mb-4">
                    <span className="text-2xl font-bold hidden md:block italic tracking-tight">
                        InstaClone
                    </span>
                    <span className="md:hidden">
                        <Instagram size={28} />
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-2 px-2 md:px-4">
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => sidebarHandler(item.text)}
                            className="flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-xl cursor-pointer text-gray-800 hover:bg-gray-100 transition-all group"
                        >
                            <div className="group-hover:scale-110 transition-transform duration-200">
                                {item.icon}
                            </div>
                            <span className="hidden md:inline text-base font-medium">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-6 text-[10px] text-gray-400 hidden md:block">
                © 2026 INSTACLONE BY RAJ SINGH
            </div>
        </aside>
    );
};

export default Sidebar;