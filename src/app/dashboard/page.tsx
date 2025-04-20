"use client"
import { useState } from "react";
import { FaUtensils, FaPlus, FaPizzaSlice, FaShoppingCart, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import Orders from "../orders/page";
import Meals from "../meals/page";
import Loading from "../loading";
import { ManageRestoAdminProvider } from "../Context/ManageRestoOwnerContext";
import MealAdd from "../addMeal/page";

export default function Dashboard() {
    const [showOrders, setShowOrders] = useState(false);
    const [showMeals, setShowMeals] = useState(false);
    const [showAddMeals, setShowAddMeals] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
                    <li
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => {
                            setShowOrders(true);
                            setShowMeals(false);
                            setShowAddMeals(false);
                        }}
                    >
                        <FaShoppingCart size={20} />
                        {sidebarOpen && <span className="text-lg">Orders</span>}
                    </li>
                    <li
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => {
                            setShowOrders(false);
                            setShowMeals(true);
                            setShowAddMeals(false);
                        }}
                    >
                        <FaPizzaSlice size={20} />
                        {sidebarOpen && <span className="text-lg">Meals</span>}
                    </li>
                    <li
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer transition"
                        onClick={() => {
                            setShowOrders(false);
                            setShowMeals(false);
                            setShowAddMeals(true);
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <FaUtensils size={20} />
                            <FaPlus size={14} />
                        </div>
                        {sidebarOpen && <span className="text-lg">Add Meals</span>}
                    </li>
                </ul>

                {/* Settings & Logout */}
                <div className="absolute bottom-6 left-0 w-full px-4">
                    <div className="flex justify-between">
                        <FaSignOutAlt size={30} className="cursor-pointer hover:text-red-400" onClick={() => window.location.href="/"} />
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

            {/* Content */}
            <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
                <ManageRestoAdminProvider>
                    {showOrders && <Orders />}
                    {showMeals && <Meals />}
                    {showAddMeals && <MealAdd />}
                    {!showOrders && !showMeals && !showAddMeals && <Loading />}
                </ManageRestoAdminProvider>
            </div>
        </div>
    );
}
