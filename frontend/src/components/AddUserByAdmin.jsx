import React, { useState } from "react";
import { validatePassword, validateEmail } from "../utils/validate.js";
import { useAdminStore } from "../stores/admin.store.js";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AddUserPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const { addUser, adminDashboard } = useAdminStore();
    const navigate = useNavigate();

    const validateField = (field, value) => {
        const fieldErrors = {};
        switch (field) {
            case "name":
                if (!value.trim()) fieldErrors.name = "Name is required";
                else if (value.trim().length < 2) fieldErrors.name = "Name must be at least 2 characters";
                else if (value.trim().length > 50) fieldErrors.name = "Name must not exceed 50 characters";
                else if (!/^[a-zA-Z\s]+$/.test(value.trim())) fieldErrors.name = "Name can only contain letters";
                break;
            case "email":
                const emailValidation = validateEmail(value);
                if (!emailValidation.isValid) fieldErrors.email = emailValidation.message;
                break;
            case "password":
                const passwordValidation = validatePassword(value);
                if (!passwordValidation.isValid) fieldErrors.password = passwordValidation.message;
                break;
            case "address":
                if (!value.trim()) fieldErrors.address = "Address is required";
                else if (value.trim().length < 10) fieldErrors.address = "Address must be at least 10 characters";
                else if (value.trim().length > 200) fieldErrors.address = "Address must not exceed 200 characters";
                break;
            case "role":
                if (!["user", "admin", "store_owner"].includes(value))
                    fieldErrors.role = "Please select a valid role";
                break;
            default:
                break;
        }
        return fieldErrors;
    };

    const validateAll = () => {
        const allErrors = {};
        Object.keys(formData).forEach((field) => {
            const fieldErrors = validateField(field, formData[field]);
            Object.assign(allErrors, fieldErrors);
        });
        setErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            const fieldErrors = validateField(field, value);
            setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || null }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const fieldErrors = validateField(field, formData[field]);
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || null }));
    };

    const handleReset = () => {
        setFormData({ name: "", email: "", password: "", address: "", role: "user" });
        setErrors({});
        setTouched({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(Object.fromEntries(Object.keys(formData).map((k) => [k, true])));

        if (!validateAll()) return;

        setLoading(true);
        try {
            const emailValidation = validateEmail(formData.email);
            const payload = {
                ...formData,
                email: emailValidation.normalizedEmail,
                name: formData.name.trim(),
                address: formData.address.trim(),
            };
            await addUser(payload);
            await adminDashboard();
            navigate("/admin/dashboard");
        } catch (err) {
            console.error(err);
            setErrors({ submit: err.response?.data?.message || "Failed to add user" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors[field] ? "border-red-500" : "border-gray-300"
        }`;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
            <div className="max-w-md w-full">
                <div className="mb-6">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg px-2 py-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New User</h2>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Name", key: "name", type: "text", placeholder: "Enter full name" },
                            { label: "Email", key: "email", type: "email", placeholder: "Enter email" },
                            {
                                label: "Password",
                                key: "password",
                                type: "password",
                                placeholder: "Enter secure password",
                                helper: "Password must be 8-50 chars with uppercase, lowercase, number & special character",
                            },
                        ].map(({ label, key, type, placeholder, helper }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={formData[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    onBlur={() => handleBlur(key)}
                                    className={inputClass(key)}
                                    disabled={loading}
                                />
                                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                                {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                placeholder="Enter complete address"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                rows={3}
                                className={`${inputClass("address")} resize-none`}
                                disabled={loading}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                onBlur={() => handleBlur("role")}
                                className={inputClass("role")}
                                disabled={loading}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                disabled={loading}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Adding User..." : "Add User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserPage;
