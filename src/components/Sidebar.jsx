import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {SIDEBAR_DATA} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {User} from "lucide-react";

const Sidebar = ({activeMenu, onItemClick, variant = "desktop"}) => {
    const {user} = useContext(AppContext);
    const navigate = useNavigate();
    const sidebarClassName = variant === "mobile"
        ? "w-full max-h-[calc(100vh-73px)] overflow-y-auto bg-slate-950 p-5"
        : "w-64 h-[calc(100vh-61px)] bg-slate-950 border-r border-slate-800 p-5 sticky top-[61px] z-20";

    const handleMenuClick = (path) => {
        navigate(path);
        onItemClick?.();
    };

    return (
        <div className={sidebarClassName}>
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img src={user?.profileImageUrl || ""}
                         alt="Profile Image"
                         className="w-20 h-20 bg-slate-700 rounded-full"/>
                ): (
                    <User className="w-20 h-20 text-xl text-slate-400" />
                )}
                <h5 className="text-slate-100 font-medium leading-6">{user.fullName || ""}</h5>
            </div>
            {SIDEBAR_DATA.map((item) => (
                <button
                    onClick={() => handleMenuClick(item.path)}
                    key={`menu_${item.id}`}
                    className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors ${activeMenu === item.label ? "text-white bg-teal-600" : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"}`}>
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export default Sidebar;
