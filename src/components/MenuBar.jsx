import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../context/AppContext.js";
import {useNavigate} from "react-router-dom";
import {LogOut, Menu, User, X} from "lucide-react";
import toast from "react-hot-toast";
import {assets} from "../assets/assets.js";
import ProfileModal from "./ProfileModal.jsx";

const MenuBar = ({openSideMenu, setOpenSideMenu}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const dropdownRef = useRef(null);
    const {user, logout} = useContext(AppContext);
    const navigate = useNavigate();
    const displayName = user?.fullName || "Guest User";
    const displayEmail = user?.email || "Not signed in";

    const handleLogout = async () => {
        try {
            await logout();
            setShowDropdown(false);
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Failed to log out, try again");
        }
    }

    const handleBrandClick = () => {
        setOpenSideMenu(false);
        navigate("/dashboard");
    }

    const handleOpenProfile = () => {
        setShowDropdown(false);
        setOpenProfileModal(true);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <>
        <div className="flex items-center justify-between gap-5 bg-slate-950/95 border-b border-slate-800 backdrop-blur-[2px] py-3 px-4 sm:px-7 sticky top-0 z-30">
            {/* Left side bar */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-slate-100 hover:bg-slate-800 p-1 rounded transition-colors">
                    {(openSideMenu ? (
                        <X className="text-2xl"/>
                    ): (
                        <Menu className="text-2xl"/>
                    ))}
                </button>
                <button
                    type="button"
                    onClick={handleBrandClick}
                    className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <img src={assets.money_manager_logo} alt="Logo" className="h-30 w-40" />
                </button>
            </div>

            {/* right side */}
            <div className="relative" ref={dropdownRef}>
                <button className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}>
                    <User className="text-teal-300" />
                </button>

                {/* dropdown menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg shadow-slate-950/40 py-1 z-50">
                        <button
                            type="button"
                            onClick={handleOpenProfile}
                            className="w-full px-4 py-3 text-left border-b border-slate-700 hover:bg-slate-800 transition-colors duration-150 cursor-pointer">
                            <div className="flex items-center gap-3">
                                {user?.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full">
                                        <User className="w-4 h-4 text-teal-300" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-100 truncate">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {displayEmail}
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* options */}
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition-colors duration-150 cursor-pointer">
                                <LogOut className="w-4 h-4 text-slate-400" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
            <ProfileModal
                isOpen={openProfileModal}
                onClose={() => setOpenProfileModal(false)}
            />
        </>
    )
}

export default MenuBar;
