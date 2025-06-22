"use client"
import { useContext, useState } from "react";
import { ManageRestoAdminContext } from "../Context/ManageRestoOwnerContext";
import { AiOutlineClose } from "react-icons/ai";
import { Toast } from "@/sweetalert";
import Loading from "../loading";

export default function Orders() {
    const { orders, delOrder, updateOrder } = useContext(ManageRestoAdminContext);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);
    const [newStatus, setNewStatus] = useState("");

    const handleEdit = (orderId: number, restaurantId: number, currentStatus: string) => {
        setEditingOrderId(orderId);
        setEditingRestaurantId(restaurantId);
        setNewStatus(currentStatus);
    };

    const handleCancel = () => {
        setEditingOrderId(null);
        setEditingRestaurantId(null);
        setNewStatus("");
    };
    const handleSubmit = () => {
        // التأكد من وجود القيم بشكل صحيح
        if (!editingOrderId || !editingRestaurantId || !newStatus) {
            // يمكنك إظهار رسالة للمستخدم في حال كانت الحقول غير مكتملة
            Toast.fire({
                title: "Error",
                icon: "error",
                text: "Please fill in all fields before submitting.",
                timer: 1500
            });
            return; // إيقاف العملية إذا كانت البيانات غير كاملة
        }
    
        // إذا كانت البيانات صحيحة، قم بتحديث الطلب
        updateOrder({
            orderId: editingOrderId,
            restaurantId: editingRestaurantId,
            newStatus:newStatus,
        });
    
        // إغلاق نافذة التعديل بعد الإرسال
        handleCancel();
    };
    return (
        <div className="p-6 overflow-scroll h-[99vh]">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            {
                orders.length > 0 ?
                <div className={`space-y-6 ${editingOrderId ? 'pointer-events-none' : ''}`}>
                    {orders.map(({
                        orderId,
                        status,
                        totalPrice,
                        phoneNumber,
                        location,
                        restaurantId,
                        orderDetails,
                    }) => (
                        <div
                            key={orderId}
                            className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
                        >
                            <div className="mb-3 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Order #{orderId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status:{" "}
                                        <span className={`font-medium ${status === "Confirmed" ? "text-green-600" : "text-yellow-600"}`}>
                                            {status}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">
                                        Total: ${totalPrice.toFixed(2)}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => delOrder(restaurantId, orderId)}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                        >
                                            حذف الطلب
                                        </button>
                                        <button
                                            onClick={() => handleEdit(orderId, restaurantId, status)}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                                        >
                                            تعديل
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                <p>Phone: {phoneNumber}</p>
                                <p>Location: {location}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Ordered Meals:</h4>
                                <ul className="space-y-2">
                                    {orderDetails.map(({ mealName, quantity, subTotalPrice }, idx) => (
                                        <li
                                            key={idx}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded"
                                        >
                                            <span className="font-medium">{mealName}</span>
                                            <div className="text-sm text-gray-600">
                                                Qty: {quantity} | Subtotal: ${subTotalPrice.toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div> :
                <Loading />
            }

            {/* الفورم في Overlay */}
            {editingOrderId && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative animate-fadeIn">
                        {/* عنوان */}
                        <h3 className="text-xl font-bold mb-4 text-center">
                            تعديل الأوردر رقم {editingOrderId}
                        </h3>
                        {/* زر X لإغلاق */}
                        <button
                            onClick={handleCancel}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <AiOutlineClose size={20} />
                        </button>

                        {/* المحتوى */}
                        <label className="block mb-2 font-medium">تغيير الحالة:</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="">اختر الحالة</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                                حفظ
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
