// DataTable.jsx
import React from "react";
import { Search, X, Star, BarChart3 } from "lucide-react";

const DataTable = ({ title, data, columns, filters, onFilterChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {data.length} records
                    </span>
                </div>

                {/* Filters (Always Visible) */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filters.map((filter, index) => (
                            <div key={index} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={`Filter by ${filter.label}`}
                                    value={filter.value}
                                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                                {filter.value && (
                                    <button
                                        onClick={() => onFilterChange(filter.key, "")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {col === "Rating" && row[col] !== "-" ? (
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                    <span>{row[col]}</span>
                                                </div>
                                            ) : col === "Role" ? (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row[col] === "store_owner"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {row[col].replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </span>
                                            ) : (
                                                row[col] || "-"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="text-gray-400">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm font-medium text-gray-500">No records found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
