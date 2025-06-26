"use client";
import { useState } from "react";
import { FaUtensils, FaPlus, FaPizzaSlice, FaShoppingCart, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import Orders from "../orders/page";
import Meals from "../meals/page";
import MealAdd from "../addMeal/page";
import Rate from "@/components/Rateings";
import { ManageRestoAdminProvider } from "../Context/ManageRestoOwnerContext";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<string>("welcome");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const navItems = [
        { id: "orders", label: "Orders", icon: <FaShoppingCart size={20} /> },
        { id: "meals", label: "Meals", icon: <FaPizzaSlice size={20} /> },
        { id: "addMeals", label: "Add Meals", icon: <><FaUtensils size={20} /><FaPlus size={14} /></> },
        { id: "rates", label: "Rates", icon: <FaStar size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "orders":
                return <Orders />;
            case "meals":
                return <Meals />;
            case "addMeals":
                return <MealAdd />;
            case "rates":
                return <Rate />;
            default:
                return (
                    <div className="text-center mt-20 text-gray-700 animate-fadeIn">
                        <h1 className="text-4xl font-bold mb-4">🎉 Welcome to the Dashboard</h1>
                        <p className="text-lg">Please select a section from the sidebar to get started.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Sidebar */}
            <div className={`bg-black/80 text-white transition-all duration-500 ease-in-out ${sidebarOpen ? "w-[220px]" : "w-[60px]"} hidden sm:block`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className={`text-2xl font-bold ${!sidebarOpen && "hidden"}`}>Dashboard</h2>
                    <button onClick={toggleSidebar} className="text-white hover:text-gray-400">
                        <FaBars />
                    </button>
                </div>

                <ul className="flex flex-col gap-2 px-4 mt-6">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={`p-2 rounded-md transition cursor-pointer ${
                                activeTab === item.id ? "bg-white/60 text-white" : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <a className="flex items-center gap-3">
                                {item.icon}
                                {sidebarOpen && <span className="text-lg">{item.label}</span>}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Settings & Logout */}
                <div className="absolute bottom-6 left-0 w-full px-4">
                    <div className="flex justify-between">
                        <FaSignOutAlt size={30} className="cursor-pointer hover:text-red-400" onClick={() => window.location.href = "/"} />
                        <FaCog size={30} className="cursor-pointer hover:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Toggle for small screens */}
            <div className="sm:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleSidebar} className="bg-black text-white p-2 rounded-md shadow-md">
                    <FaBars />
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
                <ManageRestoAdminProvider>
                    {renderContent()}
                </ManageRestoAdminProvider>
            </div>
        </div>
    );
}
