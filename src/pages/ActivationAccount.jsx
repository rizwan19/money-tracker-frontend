import {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {assets} from "../assets/assets.js";

const REDIRECT_DELAY_MS = 3000;

const ActivationAccount = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const timerRef = useRef(null);

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const token = searchParams.get("token");

        const scheduleRedirect = () => {
            timerRef.current = setTimeout(() => {
                navigate("/login", {replace: true});
            }, REDIRECT_DELAY_MS);
        };

        const activateAccount = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid activation token.");
                scheduleRedirect();
                return;
            }

            try {
                const response = await axiosConfig.get(API_ENDPOINTS.ACTIVATE, {
                    params: {token}
                });
                setStatus("success");
                setMessage(response.data?.message || "Profile activated successfully.");
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Invalid activation token.");
            } finally {
                scheduleRedirect();
            }
        };

        activateAccount();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [navigate, searchParams]);

    const title = status === "loading"
        ? "Activating Account"
        : status === "success"
            ? "Email Verified"
            : "Activation Failed";

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            <img
                src={assets.login_bg}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm pointer-events-none"
            />
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 text-center">
                    <h1 className="text-2xl font-semibold text-black mb-4">{title}</h1>
                    <p className="text-slate-700">{message}</p>
                    {status !== "loading" && (
                        <p className="text-sm text-slate-500 mt-4">
                            Redirecting to login in 3 seconds...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivationAccount;
