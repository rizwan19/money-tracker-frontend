import MenuBar from "./MenuBar.jsx";
import Sidebar from "./Sidebar.jsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../context/AppContext.jsx";

const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= 1024 : false
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");

        const handleChange = (event) => {
            setIsDesktop(event.matches);

            if (event.matches) {
                setOpenSideMenu(false);
            }
        };

        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <div>
            <MenuBar
                openSideMenu={openSideMenu}
                setOpenSideMenu={setOpenSideMenu}
            />
            {user && (
                <div className="flex">
                    {isDesktop && (
                        <div className="hidden lg:block">
                            <Sidebar activeMenu={activeMenu} variant="desktop"/>
                        </div>
                    )}
                    <div className="grow mx-5">
                        {children}
                    </div>
                    {!isDesktop && openSideMenu && (
                        <div className="fixed left-0 right-0 bg-white border-b border-gray-200 top-[73px] z-20 lg:hidden">
                            <Sidebar
                                activeMenu={activeMenu}
                                onItemClick={() => setOpenSideMenu(false)}
                                variant="mobile"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard;
