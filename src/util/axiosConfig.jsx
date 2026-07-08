import axios from "axios";
import {clearAccessToken, getAccessToken, setAccessToken} from "./authToken.js";
import {API_ENDPOINTS} from "./apiEndpoints.js";

const axiosConfig = axios.create({
    // baseURL: "https://money-tracker-3nbw.onrender.com/api/v1",
    baseURL: "http://localhost:8080/api/v1.0",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

const excludeEndpoints = [
    "/profile/login",
    "/profile/register",
    "/profile/activate",
    "/profile/refresh-token",
    "/profile/logout",
    "/health",
    "/status"
];

const isExcluded = (url) => excludeEndpoints.some((endpoint) => url?.includes(endpoint));

let refreshPromise = null;

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${axiosConfig.defaults.baseURL}${API_ENDPOINTS.REFRESH_TOKEN}`, null, {
                withCredentials: true
            })
            .then((response) => {
                const token = response.data?.accessToken;
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

axiosConfig.interceptors.request.use(async config => {
    if (isExcluded(config.url)) {
        return config;
    }

    let token = getAccessToken();
    if (!token) {
        token = await refreshAccessToken();
    }
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

axiosConfig.interceptors.response.use(response => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (
        error.response &&
        error.response.status === 401 &&
        originalRequest &&
        !isExcluded(originalRequest.url) &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true;
        try {
            const token = await refreshAccessToken();
            if (token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return axiosConfig(originalRequest);
            }
        } catch {
            // fall through to redirect below
        }
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(error);
    }

    if (error.response && error.response.status === 500) {
        console.log("Server error:", error.response.data);
    }
    return Promise.reject(error);
})

export default axiosConfig;
