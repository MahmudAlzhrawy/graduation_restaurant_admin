"use client";

import { Toast } from "@/sweetalert";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

// ✅ [1] أنواع البيانات Interfaces
interface AddMeal {
MealName: string;
Description: string;
Price: number;
MealImage: File|null ;
CategoryId: number;
}

interface Meal {
id: number;
quantity: number;
mealId: number;
mealName: string;
description: string;
price: number;
mealImage: string;
restaurantId: number;
categoryId: number;
}

interface orderedMeals {
mealName: string;
quantity: number;
subTotalPrice: number;
}
interface OrderAPIResponse {
  $id: string;
  $values: OrderAPIItem[];
}

interface OrderAPIItem {
  userId: number;
  orderId: number;
  restaurantId: number;
  totalPrice: number;
  status: string;
  location: string;
  phoneNumber: string;
  orderDetails?: {
    $id: string;
    $values: orderedMeals[];
  };
}


interface order {
userId: number;
orderId: number;
restaurantId: number;
totalPrice: number;
status: string;
location: string;
phoneNumber: string;
orderDetails: orderedMeals[];
}

interface updateOrder {
orderId: number;
restaurantId: number;
newStatus: string;
}

interface review {
nameU: string;
ratingId: number;
userId: number;
restaurantId: number;
ratingValue: number;
review: string;
ratingDate: string;
}

interface Restaurant {
city: string;
rating: number;
restaurantId: number;
restaurantName: string;
location: string;
phoneNumber: string;
cuisineType: string;
restaurantImage: string;
status: string;
cityCode: string;
restaurantDescription: string;
deliveryFee: number;
}
interface Transaction{
    transactionId: number,
    userId: number,
    transactionDate:string
    amount:number,
    paymentMethod: string,
    status: string,
    transactionType:string,
    referenceId: number
}

interface ManagerestoOwnerContext {
counter:number;
meals: Meal[];
orders: order[];
review: review[];
transaction?: Transaction;
currentRestaurant: Restaurant[];
admintoken: string | null;
adminId: number | null;
setcounter:Dispatch<SetStateAction<number>>;
updateTransaction:(transactionId:number,newStatus:string)=>void;
getTrnsactions:(orderId:number)=>void;
addMeal: (Meal: AddMeal) => void;
delMeal: (mealId: number) => void;
updateMeal: (Meal: AddMeal, mealId: number) => void;
updateOrder: (ord: updateOrder) => void;
delOrder: (restaurantId: number, orderId: number) => void;
removeReview: (rateId: number) => void;
}


// ✅ [2] إنشاء السياق
export const ManageRestoAdminContext = createContext<ManagerestoOwnerContext>({
counter:0,
meals: [],
orders: [],
review: [],
transaction:undefined,
currentRestaurant: [],
admintoken: null,
adminId: null,
setcounter:()=>{},
updateTransaction:()=>{},
getTrnsactions:()=>{},
addMeal: () => {},
delMeal: () => {},
updateMeal: () => {},
updateOrder: () => {},
delOrder: () => {},
removeReview: () => {},
});

// ✅ [3] Provider
export const ManageRestoAdminProvider: React.FC<{ children: React.ReactNode }> = ({
children,
}) => {
// ✅ [A] الحالة
const [meals, setMeals] = useState<Meal[]>([]);
const [orders, setOrders] = useState<order[]>([]);
const [review, setReviews] = useState<review[]>([]);
const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant[]>([]);
const [restaurantId, setRestaurantId] = useState<number | null>(null);
const [refreshTrigger, setRefreshTrigger] = useState(0);
const [admintoken, setAdminToken] = useState<string | null>(null);
const [adminId, setAdminId] = useState<number | null>(null);
const [transaction,setTransaction]=useState<Transaction |undefined>(undefined)
const[counter,setcounter]=useState<number>(0)
// ✅ [B] تحميل admin info من localStorage
useEffect(() => {
if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    const id = localStorage.getItem("adminId");

    setAdminToken(token);
    setAdminId(id ? Number(id) : null);
}
}, []);

// ✅ [C] تحميل بيانات المطعم
useEffect(() => {
if (adminId && admintoken) {
    const fetchRestaurant = async () => {
    try {
        const res = await fetch(
        `https://citypulse.runasp.net/api/RestaurantStaf/(GetRestaurantbyAdminId)?adminId=${adminId}`,
        {
            headers: { Authorization: `Bearer ${admintoken}` },
        }
        );
        const data = await res.json();
        setCurrentRestaurant(data ? [data] : []);
        setRestaurantId(data.restaurantId);
    } catch (e) {
        console.error("Error fetching restaurant", e);
    }
    };

    fetchRestaurant();
}
}, [adminId, admintoken]);

// ✅ [D] تحميل الوجبات
useEffect(() => {
if (restaurantId) {
    const fetchMeals = async () => {
    try {
        const res = await fetch(
        `https://citypulse.runasp.net/api/Restaurant/AllMeals/${restaurantId}`
        );
        const data = await res.json();
        setMeals(data.$values || []);
    } catch (e) {
        console.error("Error fetching meals", e);
    }
    };

    fetchMeals();
}
}, [restaurantId, refreshTrigger]);

// ✅ [E] تحميل الطلبات
useEffect(() => {
if (adminId && admintoken) {
const fetchOrders = async () => {
try {
const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/GetOrdersByAdminId/${adminId}`,
    {
    headers: {
        Authorization: `Bearer ${admintoken}`,
    },
    }
);

const contentType = res.headers.get("content-type");

if (res.ok) {
    if (contentType && contentType.includes("application/json")) {
    const data:OrderAPIResponse = await res.json();
    const formatted = data?.$values?.map((o:OrderAPIItem) => ({
        userId: o.userId,
        orderId: o.orderId,
        restaurantId: o.restaurantId,
        totalPrice: o.totalPrice,
        status: o.status,
        location: o.location,
        phoneNumber: o.phoneNumber,
        orderDetails: o.orderDetails?.$values || [],
    }));
    setOrders(formatted || []);
    } else {
    const text = await res.text();
    console.warn("Received non-JSON response:", text);
    setOrders([]); // عشان تفضي اللي قبلها لو مفيش طلبات
    }
} else {
    const errorText = await res.text();
    console.error("API Error:", errorText);
}
} catch (e) {
console.error("Error fetching orders", e);
}
};

fetchOrders();
}
}, [refreshTrigger, adminId, admintoken,counter]);


// ✅ [F] تحميل التقييمات
useEffect(() => {
    console.log("adminId:", adminId);
    console.log("token:", admintoken);
    console.log("resto id ", restaurantId)
    if (restaurantId) {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `https://citypulse.runasp.net/api/Restaurant/AllRestaurantRating /${restaurantId}`
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const text = await res.text();
                const data = text ? JSON.parse(text) : { $values: [] };
                console.log(data)
                setReviews(data.$values || []);
            } catch (e) {
                console.error("Error fetching reviews", e);
            }
        };

        fetchReviews();
    }
}, [counter]);


// ✅ [G] تحديث حالة الطلب
const updateOrder = async (ord: updateOrder) => {
const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/update-status`,
    {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admintoken}`,
    },
    body: JSON.stringify(ord),
    }
);

if (res.ok) {
    Toast.fire({ title: "Status Updated", icon: "success" });
    setRefreshTrigger((prev) => prev + 1);
} else {
    Toast.fire({ title: "Status Update Failed", icon: "error" });
}
};

// ✅ [H] إضافة وجبة
const addMeal = async (meal: AddMeal) => {
const form = new FormData();
form.append("MealName", meal.MealName);
form.append("MealImage", meal.MealImage!);
form.append("Description", meal.Description);
form.append("Price", meal.Price.toString());
form.append("CategoryId", meal.CategoryId.toString());
form.append("RestaurantId", restaurantId!.toString());

const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/AddNewMeal`,
    {
    method: "POST",
    headers: { Authorization: `Bearer ${admintoken}` },
    body: form,
    }
);

if (res.ok) {
    Toast.fire({ title: "Meal Added", icon: "success" });
    setRefreshTrigger((prev) => prev + 1);
} else {
    Toast.fire({ title: "Add Meal Failed", icon: "error" });
}
};

// ✅ [I] تحديث وجبة
const updateMeal = async (meal: AddMeal, mealId: number) => {
const form = new FormData();
form.append("MealName", meal.MealName);
form.append("MealImage", meal.MealImage!);
form.append("Description", meal.Description);
form.append("Price", meal.Price.toString());
form.append("CategoryId", meal.CategoryId.toString());
form.append("RestaurantId", restaurantId!.toString());

const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/UpdateMeal/${mealId}`,
    {
    method: "PUT",
    headers: { Authorization: `Bearer ${admintoken}` },
    body: form,
    }
);

if (res.ok) {
    Toast.fire({ title: "Meal Updated", icon: "success" });
    setRefreshTrigger((prev) => prev + 1);
} else {
    Toast.fire({ title: "Update Failed", icon: "error" });
}
};

// ✅ [J] حذف وجبة
const delMeal = async (mealId: number) => {
const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/DeleteMeal?mealId=${mealId}&restaurantId=${restaurantId}`,
    {
    method: "DELETE",
    headers: { Authorization: `Bearer ${admintoken}` },
    }
);

if (res.ok) {
    Toast.fire({ title: "Meal Deleted", icon: "success" });
    setMeals((prev) => prev.filter((m) => m.mealId !== mealId));
} else {
    Toast.fire({ title: "Delete Failed", icon: "error" });
}
};

// ✅ [K] حذف طلب
const delOrder = async (restaurantId: number, orderId: number) => {
const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/DeleteOrder?OrderId=${orderId}&RestaurantId=${restaurantId}`,
    {
    method: "DELETE",
    headers: { Authorization: `Bearer ${admintoken}` },
    }
);

if (res.ok) {
    Toast.fire({ title: "Order Deleted", icon: "success" });
    setOrders((prev) =>
    prev.filter(
        (o) => o.restaurantId !== restaurantId || o.orderId !== orderId
    )
    );
} else {
    Toast.fire({ title: "Delete Failed", icon: "error" });
}
};

// ✅ [L] حذف تقييم
const removeReview = async (rateId: number) => {
const res = await fetch(
    `https://citypulse.runasp.net/api/RestaurantStaf/DeleteCommentById?id=${restaurantId}`,
    {
    method: "DELETE",
    headers: { Authorization: `Bearer ${admintoken}` },
    }
);

if (res.ok) {
    Toast.fire({ title: "Review Deleted", icon: "success" });
    setReviews((prev) => prev.filter((r) => r.ratingId !== rateId));
} else {
    Toast.fire({ title: "Delete Failed", icon: "error" });
}
};
const getTrnsactions = async (orderId: number) => {
    if (!orderId) return;

    try {
        const res = await fetch(`https://citypulse.runasp.net/api/User/GetTransaction?ReferenceId=${orderId}&type=Order`, {
            method: "GET",
            headers: { Authorization: `Bearer ${admintoken}` },
        });

        if (res.ok) {
            const data: Transaction = await res.json();
            console.log("✅ fetched transaction successfully", data);
            setTransaction(data);
        } else {
            const errorText = await res.text(); // طباعة محتوى الاستجابة الخطأ
            console.log("❌", res.status, errorText);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
};

const updateTransaction=async(transactionId:number,newStatus:string)=>{
    const res= await fetch(`https://citypulse.runasp.net/api/User/UpdateTransactionStatus?transactionId=${transactionId}&newStatus=${newStatus}`,{
        method:'PUT',
        headers: { Authorization: `Bearer ${admintoken}` },

    })
    if (res.ok) {
            Toast.fire({
                title:"transaction status Updeted successfully",
                icon:"success",
            })
            console.log("✅ updated transaction successfully");
        
        } else {
            const errorText = await res.text(); // طباعة محتوى الاستجابة الخطأ
            console.log("❌", res.status, errorText);
        }

}

// ✅ [Z] إرجاع المزود
return (
<ManageRestoAdminContext.Provider

    value={{
    counter,
    setcounter,
    transaction,
    updateTransaction,
    getTrnsactions,
    meals,
    orders,
    currentRestaurant,
    review,
    admintoken,
    adminId,
    addMeal,
    updateMeal,
    delMeal,
    delOrder,
    updateOrder,
    removeReview,
    }}
>
    {children}
</ManageRestoAdminContext.Provider>
);
};
