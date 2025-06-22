"use client"
import { useContext } from "react";
import { ManageRestoAdminContext } from "../Context/ManageRestoOwnerContext";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default function Meals() {
    const { meals, delMeal } = useContext(ManageRestoAdminContext);

    const handelUpdate = (mealId: number) => {
        redirect(`/updateMeal/${mealId}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* العنوان */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">🍽️ Meals</h1>
                {/* يمكنك إضافة زر لإضافة وجبة جديدة هنا */}
            </div>

            {/* محتوى الوجبات */}
            {meals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meals.map(({ id, mealId, mealName, description, price,mealImage },index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={`https://citypulse.runasp.net${mealImage}`}
                                alt={mealName}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col justify-between h-[200px]">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{mealName}</h2>
                                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-lg font-semibold text-green-600">
                                        ${price.toFixed(2)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handelUpdate(mealId)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => delMeal(mealId)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}
