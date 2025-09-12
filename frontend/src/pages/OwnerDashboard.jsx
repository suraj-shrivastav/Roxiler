import React, { useEffect } from "react";
import { useAuth } from "../stores/auth.store.js";
import { useOwnerStore } from "../stores/owner.store.js";

export default function OwnerDashboard() {
    const logout = useAuth((state) => state.logout);
    const { ownerDashboardData, loading, error, fetchDashboard } = useOwnerStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        console.log("Owner Dashboard Data:", ownerDashboardData);
    }, [ownerDashboardData]);

    const groupedData = {};
    if (ownerDashboardData && ownerDashboardData.data.length > 0) {
        ownerDashboardData.data.forEach((rating) => {
            if (!groupedData[rating.store_id]) {
                groupedData[rating.store_id] = {
                    store_name: rating.store_name,
                    overall_rating: rating.overall_rating,
                    ratings: [],
                };
            }
            groupedData[rating.store_id].ratings.push(rating);
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {loading && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-16 text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600 text-xl font-medium">Loading your dashboard...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-200/50 p-12 text-center">
                        <h3 className="text-red-800 font-semibold text-xl mb-2">Error Loading Dashboard</h3>
                        <p className="text-red-600">{error.message || "Something went wrong"}</p>
                    </div>
                )}

                {ownerDashboardData && ownerDashboardData.data.length === 0 && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-16 text-center">
                        <h3 className="text-gray-800 font-semibold text-2xl mb-2">No Ratings Yet</h3>
                        <p className="text-gray-500 text-lg">Your stores haven't received any ratings yet.</p>
                    </div>
                )}

                {ownerDashboardData && ownerDashboardData.data.length > 0 && (
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {Object.values(groupedData).map((store, idx) => (
                            <div key={idx} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">{store.store_name}</h2>
                                    <span className="inline-flex items-center px-4 py-2 bg-yellow-300 rounded-full text-sm text-gray-700 font-semibold">
                                        Overall: {store.overall_rating} ★
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    {store.ratings.map((rating, i) => (
                                        <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-gray-800 text-lg">{rating.user_name}</span>
                                                <span className="text-yellow-500 font-bold text-lg">{rating.rating} ★</span>
                                            </div>
                                            <p className="text-gray-500 text-sm">{rating.user_email}</p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {new Date(rating.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
