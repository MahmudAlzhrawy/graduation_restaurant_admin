"use client";
import { useContext, useState } from "react";
import { ManageRestoAdminContext } from "../Context/ManageRestoOwnerContext";
import { AiOutlineClose } from "react-icons/ai";
import { Toast } from "@/sweetalert";
import Loading from "../loading";

export default function Orders() {
    const { orders, delOrder, updateOrder, getTrnsactions, transaction,updateTransaction } = useContext(ManageRestoAdminContext);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [selectedOrderIdForTransaction, setSelectedOrderIdForTransaction] = useState<number | null>(null);
const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
const [showTransactionEditForm, setShowTransactionEditForm] = useState(false);
const [newTransactionStatus, setNewTransactionStatus] = useState<string>("");

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
        if (!editingOrderId || !editingRestaurantId || !newStatus) {
            Toast.fire({
                title: "Error",
                icon: "error",
                text: "Please fill in all fields before submitting.",
                timer: 1500
            });
            return;
        }

        updateOrder({
            orderId: editingOrderId,
            restaurantId: editingRestaurantId,
            newStatus: newStatus,
        });

        handleCancel();
    };

  const handleShowTransaction = async (orderId: number) => {
    // Toggle: إذا كانت نفس الأوردر، نغلق المعاملة
    if (selectedOrderIdForTransaction === orderId) {
        setSelectedOrderIdForTransaction(null);
        return;
    }

    setIsLoadingTransaction(true); // بدأ التحميل
    await getTrnsactions(orderId);
    setSelectedOrderIdForTransaction(orderId);
    setIsLoadingTransaction(false); // انتهى التحميل
};
const handleTransactionUpdateSubmit = () => {
    if (!transaction?.transactionId || !newTransactionStatus) {
        Toast.fire({
            title: "Error",
            text:"Should select new status",
            icon: "error"
        });
        return;
    }

    updateTransaction(
    transaction.transactionId,
        newTransactionStatus
    );


    setNewTransactionStatus("");
    setShowTransactionEditForm(false);
};


    return (
        <div className="p-6 overflow-scroll h-[99vh]">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            {orders.length > 0 ? (
                <div className={`space-y-6 ${editingOrderId ? "pointer-events-none" : ""}`}>
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
                                            Delete Order
                                        </button>
                                        <button
                                            onClick={() => handleEdit(orderId, restaurantId, status)}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                                        >
                                            Edit
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

                            {/* زر عرض المعاملة */}
                            <button
                                onClick={() => handleShowTransaction(orderId)}
                                className="px-4 py-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded"
                            >
                                {selectedOrderIdForTransaction === orderId ? "Hide Transaction":"Show Transaction"}
                            </button>


                            {/* عرض المعاملة أسفل الأوردر */}
                            {selectedOrderIdForTransaction === orderId && (
                                <div className="mt-4 border-t pt-4 text-sm">
                                    <h4 className="font-bold text-gray-700 mb-2">Transaction Details:</h4>

                                {isLoadingTransaction && selectedOrderIdForTransaction === orderId ? (
                                    <p className="text-blue-500 italic mt-2">Loading transaction</p>
                                ) : transaction && transaction.referenceId === orderId ? (
                                    <div className="p-4 mt-4 bg-gray-100 rounded-lg shadow space-y-2 text-gray-700 text-sm">
                                        <p><span className="font-semibold">Transaction ID:</span> {transaction.transactionId}</p>
                                        <p><span className="font-semibold">User ID:</span> {transaction.userId}</p>
                                        <p><span className="font-semibold">Amount:</span> ${transaction.amount.toFixed(2)}</p>
                                        <p><span className="font-semibold">Payment Method:</span> {transaction.paymentMethod}</p>
                                        <p><span className="font-semibold">Status:</span> {transaction.status}</p>
                                        <p><span className="font-semibold">Transaction Type:</span> {transaction.transactionType}</p>
                                        <p><span className="font-semibold">Transaction Date:</span> {new Date(transaction.transactionDate).toLocaleString()}</p>
                                        <button
                                            onClick={() => setShowTransactionEditForm(true)}
                                            className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                                        >
                                        Update Sataus
                                        </button>

                                    </div>
                                ) : selectedOrderIdForTransaction === orderId ? (
                                    <p className="text-gray-500 italic mt-2">Not found Transactions for this order</p>
                                ) : null}


                                </div>
                            )}

                        </div>
                    ))}
                </div>
            ) : (
                <Loading />
            )}
            {showTransactionEditForm && (
                <div className="fixed inset-0 bg-black/40  backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative animate-fadeIn">
                        <h3 className="text-lg font-bold mb-4 text-center">Update Transaction Status</h3>
                        
                        <label className="block mb-2 font-medium">Choose New Transaction</label>
                        <select
                            value={newTransactionStatus}
                            onChange={(e) => setNewTransactionStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="">Coose Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Canceled">Canceled</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    handleTransactionUpdateSubmit();
                                    setShowTransactionEditForm(false);
                                }}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                               Save
                            </button>
                            <button
                                onClick={() => setShowTransactionEditForm(false)}
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                            >
                              Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* الفورم في Overlay */}
            {editingOrderId && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative animate-fadeIn">
                        <h3 className="text-xl font-bold mb-4 text-center">Edit Order {editingOrderId}</h3>
                        <button
                            onClick={handleCancel}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <AiOutlineClose size={20} />
                        </button>

                        <label className="block mb-2 font-medium">Change Status</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="">Choose status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                               Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
