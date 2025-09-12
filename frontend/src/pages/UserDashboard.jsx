import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { Star, Search } from "lucide-react";

export default function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await api.get("/user/stores");
                setStores(res.data.data);
            } catch (err) {
                console.error("Error fetching stores:", err);
            }
        };
        fetchStores();
    }, []);

    const handleRating = async (store_id, rating) => {
        try {
            const res = await api.post(`/user/stores/${store_id}/rating`, { rating });
            const updatedStore = res.data.data;
            setStores((prevStores) =>
                prevStores.map((store) =>
                    store.store_id === store_id
                        ? { ...store, overall_rating: updatedStore.overall_rating, user_rating: updatedStore.user_rating }
                        : store
                )
            );
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };

    const filteredStores = stores.filter((store) =>
        store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white py-10">
            <div className="max-w-7xl mx-auto px-6">
                <header className="flex justify-center items-center mb-8">
                    <div className="relative w-100">
                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredStores.length > 0 ? (
                        filteredStores.map((store) => (
                            <div key={store.store_id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{store.store_name}</h2>
                                    <p className="text-sm text-gray-600 mb-4">{store.address}</p>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Overall Rating</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {store.overall_rating ? `${store.overall_rating}/5` : "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Your Rating</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {store.user_rating ? `${store.user_rating}/5` : "—"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRating(store.store_id, star)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${store.user_rating === star
                                                    ? "bg-yellow-400 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-500"
                                                    }`}
                                                aria-label={`Rate ${star} star`}
                                            >
                                                <Star
                                                    size={20}
                                                    fill={store.user_rating === star ? "white" : "none"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-lg">No stores match your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
