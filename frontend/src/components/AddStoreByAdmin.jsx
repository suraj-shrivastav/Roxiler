import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { validateEmail } from "../utils/validate.js";
import { useAdminStore } from "../stores/admin.store.js";

const AddStorePage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: "",
    });
    const [errors, setErrors] = useState({});
    const { adminDashboardData, adminDashboard, addStore } = useAdminStore();
    const [storeOwners, setStoreOwners] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!adminDashboardData) adminDashboard();
        if (adminDashboardData?.detailed_user_list) {
            setStoreOwners(
                adminDashboardData.detailed_user_list.filter(
                    (u) => u.role === "store_owner"
                )
            );
        }
    }, [adminDashboardData, adminDashboard]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const validateAllFields = () => {
        const newErrors = {};
        if (!formData.name.trim())
            newErrors.name = "Store name is required";
        else if (formData.name.trim().length < 2)
            newErrors.name = "Must be at least 2 characters";

        if (!validateEmail(formData.email).isValid)
            newErrors.email = "Invalid email address";

        if (!formData.address.trim())
            newErrors.address = "Store address is required";
        else if (formData.address.trim().length < 15)
            newErrors.address = "Address must be at least 15 characters";

        if (!formData.owner_id) newErrors.owner_id = "Select a store owner";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAllFields()) return;

        setLoading(true);

        const normalizedEmail = validateEmail(formData.email).normalizedEmail;
        const payload = {
            ...formData,
            email: normalizedEmail,
            name: formData.name.trim(),
            address: formData.address.trim(),
            owner_id: parseInt(formData.owner_id),
        };

        try {
            await addStore(payload);        // ✅ Add store via API
            await adminDashboard();        // ✅ Refresh dashboard data
            navigate("/admin/dashboard");   // ✅ Redirect without alert
        } catch (err) {
            console.error("Error adding store:", err);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${errors[field]
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-gray-900"
        }`;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg px-2 py-1"
                        aria-label="Back to Admin Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-sm border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Add New Store
                        </h2>
                        <p className="text-sm text-gray-600">
                            Create a new store and assign it to a store owner
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className={inputClass("name")}
                                placeholder="Enter store name"
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={inputClass("email")}
                                placeholder="store@example.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Address *
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                rows={3}
                                className={`${inputClass("address")} resize-none`}
                                placeholder="Enter complete store address"
                                disabled={loading}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Owner */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Owner *
                            </label>
                            <select
                                value={formData.owner_id}
                                onChange={(e) => handleInputChange("owner_id", e.target.value)}
                                className={inputClass("owner_id")}
                                disabled={loading || storeOwners.length === 0}
                            >
                                <option value="">Select Store Owner</option>
                                {storeOwners.map((o) => (
                                    <option key={o.email} value={o.id}>
                                        {o.name} ({o.email})
                                    </option>
                                ))}
                            </select>
                            {errors.owner_id && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    {errors.owner_id}
                                </p>
                            )}
                            {storeOwners.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1 flex items-center">
                                    ⚠️ No store owners available. Please create one first.
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({ name: "", email: "", address: "", owner_id: "" })
                                }
                                className="flex-1 px-4 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                disabled={loading}
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:transform active:scale-95"
                                disabled={loading || storeOwners.length === 0}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Adding Store...
                                    </div>
                                ) : (
                                    "Add Store"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStorePage;
