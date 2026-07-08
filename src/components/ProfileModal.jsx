import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {LoaderCircle} from "lucide-react";
import Modal from "./Modal.jsx";
import ProfilePhotoSelector from "./ProfilePhotoSelector.jsx";
import Input from "./input.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import uploadProfileImage from "../util/uploadProfileImage.js";
import {AppContext} from "../context/AppContext.js";

const EMPTY_PROFILE = {
    fullName: "",
    email: "",
    profileImageUrl: ""
};

const ProfileModal = ({isOpen, onClose}) => {
    const {user, setUser, logout} = useContext(AppContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [profileImage, setProfileImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        let isMounted = true;

        const fetchProfileDetail = async () => {
            setLoadingProfile(true);
            setError(null);
            setCurrentPassword("");
            setNewPassword("");
            setRetypePassword("");

            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_PROFILE_DETAIL);
                const profileDetail = response.data || {};
                const nextProfile = {
                    fullName: profileDetail.fullName || "",
                    email: profileDetail.email || "",
                    profileImageUrl: profileDetail.profileImageUrl || ""
                };

                if (isMounted) {
                    setProfile(nextProfile);
                    setProfileImage(nextProfile.profileImageUrl || null);
                }
            } catch (err) {
                if (isMounted) {
                    const message = err.response?.data?.message || "Failed to load profile details";
                    setError(message);
                    toast.error(message);
                }
            } finally {
                if (isMounted) {
                    setLoadingProfile(false);
                }
            }
        };

        fetchProfileDetail();

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    const handleProfileChange = (key, value) => {
        setProfile((prev) => ({...prev, [key]: value}));
    };

    const validateProfile = () => {
        if (!profile.fullName.trim()) {
            return "Full name cannot be empty.";
        }

        if (newPassword.trim() && !currentPassword.trim()) {
            return "Current password is required.";
        }

        if (newPassword.trim() && !retypePassword.trim()) {
            return "Please retype your new password.";
        }

        if (newPassword.trim() && newPassword !== retypePassword) {
            return "New password and retype password must match.";
        }

        return null;
    };

    const resolveProfileImageUrl = async () => {
        if (profileImage instanceof File) {
            const uploadedImageUrl = await uploadProfileImage(profileImage);

            if (!uploadedImageUrl) {
                throw new Error("Failed to upload profile image");
            }

            return uploadedImageUrl;
        }

        if (typeof profileImage === "string") {
            return profileImage;
        }

        return "";
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const validationMessage = validateProfile();
        if (validationMessage) {
            setError(validationMessage);
            toast.error(validationMessage);
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const profileImageUrl = await resolveProfileImageUrl();
            const payload = {
                fullName: profile.fullName.trim(),
                profileImageUrl
            };
            const shouldLogoutAfterSave = Boolean(newPassword.trim());

            if (shouldLogoutAfterSave) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
                payload.confirmPassword = retypePassword;
            }

            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, payload);
            toast.success("Profile updated successfully");

            if (shouldLogoutAfterSave) {
                await logout();
                onClose();
                navigate("/login", {replace: true});
                return;
            }

            const responseUser = response.data?.user || response.data;
            const updatedUser = responseUser?.email
                ? responseUser
                : {
                    ...user,
                    ...payload,
                    email: profile.email
                };

            setUser(updatedUser);
            onClose();
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update profile";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const isBusy = loadingProfile || saving;

    return (
        <Modal isOpen={isOpen} onClose={isBusy ? () => {} : onClose} title="Profile">
            {loadingProfile ? (
                <div className="flex items-center justify-center gap-2 py-12 text-slate-300">
                    <LoaderCircle className="h-5 w-5 animate-spin text-teal-300" />
                    Loading profile...
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />

                    <Input
                        value={profile.email}
                        onchange={() => {}}
                        label="Email Address"
                        placeholder="example@gmail.com"
                        type="text"
                        readOnly
                    />
                    <Input
                        value={profile.fullName}
                        onchange={({target}) => handleProfileChange("fullName", target.value)}
                        label="Full Name"
                        placeholder="Enter your full name"
                        type="text"
                    />
                    <Input
                        value={currentPassword}
                        onchange={({target}) => setCurrentPassword(target.value)}
                        label="Current Password"
                        placeholder="********"
                        type="password"
                    />
                    <Input
                        value={newPassword}
                        onchange={({target}) => setNewPassword(target.value)}
                        label="New Password"
                        placeholder="********"
                        type="password"
                    />
                    <Input
                        value={retypePassword}
                        onchange={({target}) => setRetypePassword(target.value)}
                        label="Retype Password"
                        placeholder="********"
                        type="password"
                    />

                    {error && (
                        <p className="mb-4 rounded border border-red-900 bg-red-950/70 p-2 text-center text-sm text-red-200">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={onClose}
                            className="add-btn">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="add-btn add-btn-fill">
                            {saving ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ProfileModal;
