import React, { useState } from "react";
import { useAuth } from "../stores/auth.store.js";
import { validatePassword } from "../utils/validate.js";
import { User, Mail, MapPin, Shield, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export default function ProfilePage() {
    const user = useAuth((state) => state.user);
    const updatePassword = useAuth((state) => state.updatePassword);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsSuccess(false);

        // Validate new password before sending to backend
        const { isValid, errors } = validatePassword(formData.newPassword);
        if (!isValid) {
            setMessage(errors[0]); // show the first error
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            const res = await updatePassword(formData);
            setMessage(res.message);
            setIsSuccess(res.success);

            if (res.success) {
                setFormData({ ...formData, currentPassword: "", newPassword: "" });
                setTimeout(() => {
                    setMessage("");
                    setIsSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setMessage("An unexpected error occurred.");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };
    const getRoleDisplayName = (role) =>
        role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-gray-900 text-white";
            case "store_owner":
                return "bg-gray-700 text-white";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                            <User className="w-12 h-12 text-gray-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                        <div className="flex items-center justify-center space-x-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                {getRoleDisplayName(user.role)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                            <p className="text-sm text-gray-500 mt-1">Your account details and information</p>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-base text-gray-900 mt-1">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                    <p className="text-base text-gray-900 mt-1">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-base text-gray-900 mt-1">
                                        {user.address || (
                                            <span className="text-gray-400 italic">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500">Account Role</p>
                                    <p className="text-base text-gray-900 mt-1">{getRoleDisplayName(user.role)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Lock className="w-5 h-5 mr-2" />
                                Security Settings
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
                        </div>
                        <div className="px-6 py-5">
                            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            placeholder="Enter your current password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="Enter your new password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-900 text-white hover:bg-black focus:ring-gray-900 active:transform active:scale-95'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Updating Password...
                                        </div>
                                    ) : (
                                        "Update Password"
                                    )}
                                </button>
                            </form>

                            {message && (
                                <div className={`mt-4 p-4 rounded-xl flex items-start space-x-3 ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {isSuccess ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm font-medium">{message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
