import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../stores/auth.store.js";
import { validatePassword } from "../utils/validate.js";
import {
    User,
    Mail,
    Lock,
    MapPin,
    Eye,
    EyeOff,
    UserPlus,
    Loader2,
    AlertCircle,
    Shield,
} from "lucide-react";

export default function SignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const signup = useAuth((state) => state.signup);

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Required";
        else if (form.name.trim().length < 2) errs.name = "Too short";

        if (!form.email) errs.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid";

        const { isValid, message } = validatePassword(form.password);
        if (!isValid) errs.password = message;

        if (!form.confirmPassword) errs.confirmPassword = "Required";
        else if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Mismatch";

        if (!form.address.trim()) errs.address = "Required";
        else if (form.address.trim().length < 5) errs.address = "Incomplete";

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
            const { confirmPassword, ...signupData } = form;
            await signup(signupData);
        } catch (err) {
            setErrors({
                submit: err.message || "Signup failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
     focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
     ${errors[field] ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}
     text-gray-900 placeholder-gray-500`;

    const renderFieldError = (field, id) =>
        errors[field] && (
            <div className="flex items-center space-x-2 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p id={id}>{errors[field]}</p>
            </div>
        );

    const renderPasswordToggle = (show, setShow, label) => (
        <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
    );

    const renderInput = ({
        id,
        name,
        type,
        label,
        autoComplete,
        placeholder,
        icon: Icon,
        show,
        setShow,
        toggle = false,
    }) => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    name={name}
                    type={toggle && show ? "text" : type}
                    autoComplete={autoComplete}
                    required
                    value={form[name]}
                    onChange={handleChange}
                    className={inputClass(name)}
                    placeholder={placeholder}
                    aria-describedby={errors[name] ? `${id}-error` : undefined}
                />
                {toggle && renderPasswordToggle(show, setShow, label)}
            </div>
            {renderFieldError(name, `${id}-error`)}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                    <p className="text-gray-600">Join us today</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6" noValidate>
                    {renderInput({
                        id: "name",
                        name: "name",
                        type: "text",
                        label: "Full Name",
                        autoComplete: "name",
                        placeholder: "Enter your name",
                        icon: User,
                    })}
                    {renderInput({
                        id: "email",
                        name: "email",
                        type: "email",
                        label: "Email Address",
                        autoComplete: "email",
                        placeholder: "Enter your email",
                        icon: Mail,
                    })}
                    {renderInput({
                        id: "password",
                        name: "password",
                        type: "password",
                        label: "Password",
                        autoComplete: "new-password",
                        placeholder: "Create a password",
                        icon: Lock,
                        show: showPassword,
                        setShow: setShowPassword,
                        toggle: true,
                    })}
                    {renderInput({
                        id: "confirmPassword",
                        name: "confirmPassword",
                        type: "password",
                        label: "Confirm Password",
                        autoComplete: "new-password",
                        placeholder: "Confirm your password",
                        icon: Shield,
                        show: showConfirmPassword,
                        setShow: setShowConfirmPassword,
                        toggle: true,
                    })}
                    {renderInput({
                        id: "address",
                        name: "address",
                        type: "text",
                        label: "Address",
                        autoComplete: "street-address",
                        placeholder: "Enter your address",
                        icon: MapPin,
                    })}

                    {errors.submit && (
                        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                <span>Create account</span>
                            </>
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-black font-medium hover:text-gray-700 transition-colors inline-flex items-center space-x-1">
                                <span>Sign in</span>
                                <User className="w-4 h-4" />
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
