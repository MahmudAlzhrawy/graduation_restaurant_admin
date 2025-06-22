"use client"
import { ManageRestoAdminContext } from "@/app/Context/ManageRestoOwnerContext";
import { Star, Trash2 } from "lucide-react";
import { useContext } from "react";

export default function Rate() {
const { review, removeReview } = useContext(ManageRestoAdminContext);

return (
<div className="main mt-4">
    <div className="container w-[98%] mx-auto">
    <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg h-[400px] overflow-y-auto p-4">
        {review.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد تقييمات حالياً.</p>
        ) : (
        review.map((data) => (
            <div
            key={data.ratingId}
            className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200"
            >
            {/* الجزء العلوي */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-semibold text-gray-800">
                {data.nameU}
                </h1>
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
            <p className="text-gray-700 text-base italic mb-3 px-1">
                "{data.review}"
            </p>

            {/* الجزء السفلي */}
            <div className="flex justify-between items-center text-sm text-gray-500">
                <p>{data.ratingDate}</p>
                <button
                onClick={() => removeReview(data.ratingId)}
                className="flex items-center text-red-500 hover:text-red-700 transition"
                >
                <Trash2 className="w-4 h-4 mr-1" />
                حذف
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
