"use client";
import { ManageRestoAdminContext } from "@/app/Context/ManageRestoOwnerContext";
import { Star, Trash2 } from "lucide-react";
import { useContext, useEffect } from "react";

export default function Rate() {
    const { review, removeReview, setcounter } = useContext(ManageRestoAdminContext);

    useEffect(() => {
        setcounter(prev => prev + 1);
    }, []);

    return (
        <div className="main min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 py-8">
            <div className="container w-[96%] max-w-5xl mx-auto">
                <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">⭐ تقييمات العملاء</h1>

                    {review.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">لا توجد تقييمات حتى الآن.</p>
                    ) : (
                        review.map((data) => (
                            <div
                                key={data.ratingId}
                                className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fadeIn"
                            >
                                {/* اسم المستخدم والتقييم */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">{data.nameU}</h2>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-6 h-6 ${
                                                    star <= data.ratingValue
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* التعليق */}
                                <p className="text-gray-700 text-base italic mb-4 px-1 border-l-4 border-yellow-400 pl-4">
                                    “{data.review}”
                                </p>

                                {/* التاريخ وزر الحذف */}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p>{new Date(data.ratingDate).toLocaleDateString()}</p>
                                    <button
                                        onClick={() => removeReview(data.ratingId)}
                                        className="flex items-center text-red-500 hover:text-red-700 transition"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
