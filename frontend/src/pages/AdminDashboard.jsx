import React, { useState, useEffect } from "react";
import {
    Users,
    Store,
    Star,
    Plus,
    BarChart3,
} from "lucide-react";
import { useAdminStore } from "../stores/admin.store.js";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable.jsx";

const StatCard = ({ title, value, icon: IconComponent }) => (
    <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:border-gray-200">
        <div className="flex items-center justify-between">
            {/* Text Section */}
            <div className="flex-1 pr-4">
                <p className="text-sm sm:text-base font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    {title}
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{value}</p>
            </div>

            {/* Icon Section */}
            <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
                </div>
            </div>
        </div>
    </div>
);


const NavigationTabs = ({ tabs, activeTab, onTabChange }) => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 py-3 sm:py-4">
                <nav className="flex flex-wrap space-x-2 sm:space-x-4 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center py-2 px-3 whitespace-nowrap border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 ${activeTab === tab.id
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.icon && <tab.icon className="w-4 h-4 mr-1" />}
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <Link
                        to="/admin/create-user"
                        className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm bg-gray-900 text-white hover:bg-black focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 active:transform active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add User
                    </Link>
                    <Link
                        to="/admin/create-store"
                        className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 active:transform active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Store
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { adminDashboardData, loading, adminDashboard } = useAdminStore();
    const [activeTab, setActiveTab] = useState("overview");
    const [storeFilter, setStoreFilter] = useState({ name: "", email: "", address: "" });
    const [userFilter, setUserFilter] = useState({ name: "", email: "", address: "", role: "" });

    useEffect(() => {
        adminDashboard();
    }, [adminDashboard]);

    if (loading && !adminDashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-transparent border-t-gray-600 rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-gray-700">Loading Dashboard</p>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">Please wait while we fetch your data</p>
                </div>
            </div>
        );
    }

    const dashboardStats = adminDashboardData?.stats || { total_users: 0, total_stores: 0, total_ratings: 0 };
    const detailedUsers = adminDashboardData?.detailed_user_list || [];
    const storeList = adminDashboardData?.store_list || [];

    const userRatings = detailedUsers.reduce((map, user) => {
        if (user.role === "store_owner") map[user.id] = user.rating || "-";
        return map;
    }, {});

    const storesData = storeList.map(store => ({
        Name: store.name,
        Email: store.email,
        Address: store.address,
        Rating: userRatings[store.owner_id] || "-"
    }));

    const filteredStores = storesData.filter(store =>
        store.Name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
        store.Email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
        store.Address.toLowerCase().includes(storeFilter.address.toLowerCase())
    );

    const usersData = detailedUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Address: user.address,
        Role: user.role,
        Rating: user.role === "store_owner" ? (user.rating || "-") : "-"
    }));

    const filteredUsers = usersData.filter(user =>
        user.Name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
        user.Email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
        user.Address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
        user.Role.toLowerCase().includes(userFilter.role.toLowerCase())
    );

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "stores", label: "Stores", icon: Store }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {activeTab === "overview" && (
                    <div className="space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <StatCard title="Total Users" value={dashboardStats.total_users} icon={Users} />
                            <StatCard title="Total Stores" value={dashboardStats.total_stores} icon={Store} />
                            <StatCard title="Total Ratings" value={dashboardStats.total_ratings} icon={Star} />
                        </div>
                        {/* TopRatedStores component removed */}
                    </div>
                )}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <DataTable
                            title="User Management"
                            data={filteredUsers}
                            columns={["Name", "Email", "Address", "Role", "Rating"]}
                            filters={[
                                { key: "name", label: "Name", value: userFilter.name },
                                { key: "email", label: "Email", value: userFilter.email },
                                { key: "address", label: "Address", value: userFilter.address },
                                { key: "role", label: "Role", value: userFilter.role }
                            ]}
                            onFilterChange={(key, value) =>
                                setUserFilter(prev => ({ ...prev, [key]: value }))
                            }
                        />
                    </div>
                )}
                {activeTab === "stores" && (
                    <div className="space-y-6">
                        <DataTable
                            title="Store Management"
                            data={filteredStores}
                            columns={["Name", "Email", "Address", "Rating"]}
                            filters={[
                                { key: "name", label: "Name", value: storeFilter.name },
                                { key: "email", label: "Email", value: storeFilter.email },
                                { key: "address", label: "Address", value: storeFilter.address }
                            ]}
                            onFilterChange={(key, value) =>
                                setStoreFilter(prev => ({ ...prev, [key]: value }))
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
