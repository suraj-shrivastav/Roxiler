import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../stores/auth.store.js";
import { validatePassword, validateEmail } from "../utils/validate.js";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    AlertCircle,
    User,
} from "lucide-react";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const login = useAuth((state) => state.login);

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errs = {};
        const { isValid, message } = validateEmail(form.email);
        if (!isValid) errs.email = message;
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6)
            errs.password = "Password must be at least 6 characters";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setIsLoading(true);
        setErrors({});
        try {
            const emailValidation = validateEmail(form.email);
            const res = await login({
                email: emailValidation.normalizedEmail || form.email,
                password: form.password,
            });
            console.log("Login successful:", res);
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || err.message || "Login failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderFieldError = (field) =>
        errors[field] && (
            <div className="flex items-center space-x-2 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{errors[field]}</span>
            </div>
        );

    const inputClass = (field) =>
        `w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors[field]
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        } text-gray-900 placeholder-gray-500`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6" noValidate>
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className={inputClass("email")}
                                placeholder="Enter your email"
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                        </div>
                        {renderFieldError("email")}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className={inputClass("password")}
                                placeholder="Enter your password"
                                aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {renderFieldError("password")}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Sign in</span>
                            </>
                        )}
                    </button>

                    {/* Sign Up */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-black font-medium hover:text-gray-700 transition-colors inline-flex items-center space-x-1">
                                <span>Sign up</span>
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
