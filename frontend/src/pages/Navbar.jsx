import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "../stores/auth.store.js";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";

const useMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, toggle, close };
};

const NavItem = React.memo(({ to, icon: Icon, children, onClick, className = "" }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-1 px-3 py-1.5 text-sm hover:text-gray-700 rounded hover:bg-gray-100 transition-colors duration-200 ${className}`}
        aria-label={typeof children === 'string' ? children : undefined}
    >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
    </Link>
));
NavItem.displayName = 'NavItem';

export default function Navbar() {
    const user = useAuth((state) => state.user);
    const logout = useAuth((state) => state.logout);
    const navigate = useNavigate();
    const mobileMenu = useMobileMenu();

    const userState = useMemo(() => ({
        isAdmin: user?.role === 'admin',
        isLoggedIn: !!user
    }), [user]);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            mobileMenu.close();
            navigate("/", { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout, mobileMenu.close, navigate]);

    const adminNavItems = useMemo(() => [
        { to: "/admin/dashboard", icon: User, label: "Dashboard" }
    ], []);

    const authNavItems = useMemo(() => [
        { to: "/login", icon: User, label: "Login" }
    ], []);

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 text-gray-900 px-4 py-3 fixed w-full z-50 shadow-sm" role="navigation" aria-label="Main navigation">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-lg font-semibold hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    aria-label="Rating System home"
                >
                    <Sparkles className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    <span>Rating System</span>
                </Link>

                <div className="hidden md:flex items-center space-x-4">
                    {userState.isLoggedIn ? (
                        <div className="flex items-center space-x-1">
                            {userState.isAdmin && adminNavItems.map(item => (
                                <NavItem key={item.to} to={item.to} icon={item.icon}>{item.label}</NavItem>
                            ))}
                            <NavItem to="/profile" icon={User}>Profile</NavItem>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                aria-label="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1">
                            {authNavItems.map(item => (
                                <NavItem
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    className={item.primary ? "bg-gray-800 text-white hover:bg-gray-900 hover:text-white" : ""}
                                >
                                    {item.label}
                                </NavItem>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={mobileMenu.toggle}
                    aria-label={mobileMenu.isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenu.isOpen}
                >
                    {mobileMenu.isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {mobileMenu.isOpen && (
                <div className="md:hidden bg-white/95 border-t border-gray-200 py-4 space-y-3" role="menu">
                    <div className="px-4 space-y-1">
                        {userState.isLoggedIn ? (
                            <>
                                {userState.isAdmin && adminNavItems.map(item => (
                                    <NavItem key={item.to} to={item.to} icon={item.icon} onClick={mobileMenu.close} className="w-full justify-start py-2">{item.label}</NavItem>
                                ))}
                                <NavItem to="/profile" icon={User} onClick={mobileMenu.close} className="w-full justify-start py-2">Profile</NavItem>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    role="menuitem"
                                    aria-label="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {authNavItems.map(item => (
                                    <NavItem
                                        key={item.to}
                                        to={item.to}
                                        icon={item.icon}
                                        onClick={mobileMenu.close}
                                        className={`w-full justify-start py-2 ${item.primary ? "bg-gray-800 text-white hover:bg-gray-900 hover:text-white" : ""}`}
                                    >
                                        {item.label}
                                    </NavItem>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
