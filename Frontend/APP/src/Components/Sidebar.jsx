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
    const sidebarItems = [
        { icon: <Home size={22} />, text: "Home" },
        { icon: <Search size={22} />, text: "Search" },
        { icon: <TrendingUp size={22} />, text: "Explore" },
        { icon: <MessageCircle size={22} />, text: "Messages" },
        { icon: <Heart size={22} />, text: "Notifications" },
        { icon: <Plus size={22} />, text: "Create" },
        { icon: <User size={22} />, text: "Profile" },
        { icon: <LogOut size={22} />, text: "Logout" },
    ];
    const navigate = useNavigate()
    const logoutHandaler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Logout successful");
                navigate("/login")
            }


        } catch (error) {
            toast.error("Logout failed", error);
        }
    }
    const AddPostHandaler = async()=>{
        navigate("/AddPost")
    }
    const sidebarHandaler = (text) => {
        if (text === "Logout") {
            logoutHandaler();
        }else if (text === "Create"){
            AddPostHandaler();
        }
    }
    return (
        <aside className="h-screen fixed left-0 top-0 w-16 md:w-64 border-r bg-white flex flex-col justify-between">

            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start px-4 py-6">
                <span className="text-xl font-bold hidden md:block">
                    InstaClone
                </span>
                <span className="text-xl font-bold md:hidden">
                    <Instagram size={28} />
                </span>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-1 px-2 md:px-4" >
                {sidebarItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center md:justify-start gap-4 px-3 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200" onClick={()=>sidebarHandaler(item.text)}
                    >
                        {item.icon}
                        <span className="hidden md:inline text-sm font-medium">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 text-xs text-gray-400 hidden md:block">
                © 2025 InstaClone BY Raj singh
            </div>
        </aside>
    );
};

export default Sidebar;
