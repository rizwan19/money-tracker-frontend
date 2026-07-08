import {useEffect, useState} from "react";
import {AppContext} from "./AppContext.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {clearAccessToken, setAccessToken} from "../util/authToken.js";

export const AppContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const clearUser = () => {
        setUser(null);
    }

    const refreshSession = async () => {
        const response = await axiosConfig.post(API_ENDPOINTS.REFRESH_TOKEN);
        const accessToken = response.data?.accessToken;
        const user = response.data?.user;
        setAccessToken(accessToken);
        return {accessToken, user};
    }

    const logout = async () => {
        try {
            await axiosConfig.post(API_ENDPOINTS.LOGOUT);
        } catch {
            throw new Error("Failed to log out, try again");
        }
        clearAccessToken();
        clearUser();
    }

    useEffect(() => {
        let isMounted = true;
        const recover = async () => {
            try {
                const {user} = await refreshSession();
                if (isMounted && user) {
                    setUser(user);
                }
            } catch {
                clearAccessToken();
                if (isMounted) {
                    clearUser();
                }
            } finally {
                if (isMounted) {
                    setAuthLoading(false);
                }
            }
        };
        void recover();

        return () => {
            isMounted = false;
        };
    }, []);

    const contextValue = {
        user,
        setUser,
        clearUser,
        authLoading,
        refreshSession,
        logout
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
