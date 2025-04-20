"use client"
import { Toast } from "@/sweetalert";
import { createContext, Dispatch, SetStateAction ,useEffect,useState} from "react";
interface AddMeal{
    
    MealName: string;
    Description: string;
    Price: number;
    MealImage:File;
    CategoryId:number
}
interface Meal{
    id:number;
    quantity:number;
    mealId: number;
    mealName: string;
    description: string;
    price: number;
    mealImage: string;
    restaurantId:number;
    categoryId:number
}
interface order{
    userId:number;
    orderId: number;
    restaurantId:number;
    totalPrice: number;
    status:string;
    location:string;
    phoneNumber:string;
    orderDetails:orderedMeals[];
    
}
interface updateOrder{
    orderId:number,
    restaurantId:number;
    newStatus:string;
}
interface orderedMeals{
    mealName:string;
    quantity: number;
    subTotalPrice:number;
}
interface Restaurant{
    city: string,
    rating:number,
    restaurantId: number,
    restaurantName: string,
    location: string,
    phoneNumber: string,
    cuisineType: string,
    restaurantImage: string,
    status: string,
    cityCode: string,
    restaurantDescription:string,
    deliveryFee: number
}
interface ManagerestoOwnerContext{
    meals: Meal[];
    orders: order[];
    currentRestaurant: Restaurant[];
    admintoken: string | null;
    adminId: number | null;
    addMeal:(Meal:AddMeal) => void;
    delMeal:(mealId:number)=>void;
    updateMeal:(Meal:AddMeal,mealId:number)=>void;
    updateOrder:(ord:updateOrder)=>void;
    delOrder:(restaurantId:number, orderId:number)=>void
}
export const ManageRestoAdminContext = createContext<ManagerestoOwnerContext>({
    meals: [],
    orders: [],
    currentRestaurant: [],
    admintoken:null,
    adminId:null,
    updateOrder:(ord:updateOrder)=>{},
    addMeal:(Meal:AddMeal)=>{},
    delMeal:(mealId:number)=>{},
    updateMeal:(Meal:AddMeal,mealId:number)=>{},
    delOrder:(restaurantId:number, orderId:number)=>{}
})
export const ManageRestoAdminProvider:React.FC<{children:React.ReactNode}> =({children})=>{
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [orders, setOrders] = useState<order[]>([]);
    const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant[]>([]);
    const [restaurantId, setRestaurantId] = useState<number|null|any>(null);
    const [admintoken,  setAdminToken] = useState<string|null>(localStorage.getItem("adminToken"));
    const [adminId, setAdminId] = useState<number|null>(Number(localStorage.getItem("adminId")));
    
    const refresh= () => {
        setRefreshTrigger(prev => prev + 1);
    };
    const addMeal=async (meal:AddMeal)=>{
        const formDatabopj= new FormData();
        formDatabopj.append("MealName",meal.MealName);
        formDatabopj.append("MealImage",meal.MealImage);
        formDatabopj.append("Description",meal.Description);
        formDatabopj.append("Price",meal.Price.toString());
        formDatabopj.append("CategoryId",meal.CategoryId.toString());
        formDatabopj.append("RestaurantId",restaurantId.toString());

        try{
            const res =await fetch(`http://citypulse.runasp.net/api/RestaurantStaf/AddNewMeal`,{
                method:'POST',
                headers:{
                    'Authorization': `Bearer ${admintoken}`
                },
                body:formDatabopj
            })
            if(res.ok){
                Toast.fire({
                    title:'Add Meal',
                    icon:"success",
                    text:'The Meal Added successfully',
                    timer:1500
                })
                console.log(" Added Meal",{...meal,restaurantId});
                refresh();
            }
            else{
                Toast.fire({
                    title:'Add Meal',
                    icon:"error",
                    text:"The Meal Added Faild ",
                    timer:1500
                })
                console.log(" Added Meal",{...meal,restaurantId});

            }
        }catch(e){
            console.log("Error",e)
        }
    }
    const updateMeal= async (Meal:AddMeal,mealId:number)=>{
        console.log("Welcome in update")
        const formDatabopj= new FormData();
        formDatabopj.append("MealName",Meal.MealName);
        formDatabopj.append("MealImage",Meal.MealImage);
        formDatabopj.append("Description",Meal.Description);
        formDatabopj.append("Price",Meal.Price.toString());
        formDatabopj.append("CategoryId",Meal.CategoryId.toString());
        formDatabopj.append("RestaurantId",restaurantId.toString());


        try{
            const res =await fetch(`http://citypulse.runasp.net/api/RestaurantStaf/UpdateMeal/${mealId}`,{
                method:'PUT',
                headers:{
                    'Authorization': `Bearer ${admintoken}`
                },
                body:formDatabopj,
            
            })
            if(res.ok){
                Toast.fire({
                    title:'Update Meal',
                    icon:"success",
                    text:'The Meal Updated successfully',
                    timer:1500
                })
                console.log(" updated Meal",{...Meal,restaurantId});
            }
            else{
                Toast.fire({
                    title:'Update Meal',
                    icon:"error",
                    text:"The Meal updated Faild ",
                    timer:1500
                })
                console.log(" update Meal",{...Meal,restaurantId});

            }
            refresh();
        }catch(e){
            console.log("Error",e)
        }
    }
const updateOrder=async(ord:updateOrder)=>{
        const res = await fetch('http://citypulse.runasp.net/api/RestaurantStaf/update-status',{
            method:'PUT',
            headers:{
               "Content-Type": "application/json",
                'Authorization': `Bearer ${admintoken}`
            },
            body:JSON.stringify({
                ...ord
            })
        })
        if(res.ok){
            Toast.fire({
                title:"Update order status",
                icon:"success",
                text:"Updated Successfully",
                timer:1500
            })
        refresh()
        }
        else{
            Toast.fire({
                title:"Update order status",
                icon:"error",
                text:"Updated Failed",
                timer:1500
            })
        }
    }
    const delOrder= async(restaurantId:number,orderId:number)=>{
        const res= await fetch(`http://citypulse.runasp.net/api/RestaurantStaf/DeleteOrder?OrderId=${orderId}&RestaurantId=${restaurantId}`,{
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${admintoken}`
            }
            
        })
        if(res.ok){
            Toast.fire({
                title:"Delete Order",
                icon:"success",
                text:"Deleted Successfully",
                timer:1500
            })
            const updatedOrders = orders.filter(order=>order.restaurantId!==restaurantId || order.orderId!==orderId)
            setOrders(updatedOrders)
        }
        else{
            Toast.fire({
                title:"Delete Order",
                icon:"warning",
                text:"Deleted Faild",
                timer:1500
            })
        }
    }
    const delMeal = async(mealId:number)=>{
        const res= await fetch(`http://citypulse.runasp.net/api/RestaurantStaf/DeleteMeal?mealId=${mealId}&restaurantId=${restaurantId}`,{
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${admintoken}`
            }
            
        })
        if(res.ok){
            Toast.fire({
                title:"Delete Meal",
                icon:"success",
                text:"Deleted Successfully",
                timer:1500
            })
            const updatesMeals = meals.filter(meal=>meal.mealId !== mealId);
        setMeals(updatesMeals);
        }
        else{
            Toast.fire({
                title:"Delete Meal",
                icon:"warning",
                text:"Deleted Faild",
                timer:1500
            })
        }
        
    }
    useEffect(() => {
        
        if (adminId) {
            const fetchRestaurant = async () => {
                try {
                    const response = await fetch( `http://citypulse.runasp.net/api/RestaurantStaf/(GetRestaurantbyAdminId)?adminId=${adminId}`,{
                        method:"GET",
                        headers:{
                            'Authorization': `Bearer ${admintoken}`
                        }
                    })
                    const data = await response.json();
                    setCurrentRestaurant(data);
                    console.log("Fetched idre Data:", data);
                    setRestaurantId(data.restaurantId); 
                } catch (e) {
                    console.error("An error occurred while fetching restaurant", e);
                }
            };

            fetchRestaurant();
        }
    }, [adminId]);
    useEffect(() => {
        if (restaurantId !== null) {
            const fetchMeals = async () => {
                try {
                    const response = await fetch(`http://citypulse.runasp.net/api/Restaurant/AllMeals/${restaurantId}`);
                    const data = await response.json();
                    console.log("Fetched Meals:", data);
                    setMeals(data.$values || []);
                } catch (e) {
                    console.error("An error occurred while fetching meals", e);
                }
            };
    
            fetchMeals();
        }
    }, [restaurantId,refreshTrigger]); 
   
    useEffect(()=>{
        console.log(adminId , admintoken)
        const fetchedOrders =async()=>{
            try{
                const response = await fetch(`http://citypulse.runasp.net/api/RestaurantStaf/GetOrdersByAdminId/${adminId}`,{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${admintoken}`
                    }
                })
                const data = await response.json()
                const formattedOrders = data?.$values?.map((order: any) => ({
                    userId: order.userId,
                    orderId: order.orderId,
                    restaurantId: order.restaurantId,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    location: order.location,
                    phoneNumber: order.phoneNumber,
                    orderDetails: order.orderDetails?.$values || []
                })) || [];
                console.log("orders",data)
                setOrders(formattedOrders);
                
            }catch(e){
                console.error('An error occurred while fetching orders',e)
            }
        }
        fetchedOrders()
    },[refreshTrigger])

    return(
        <ManageRestoAdminContext.Provider value={{
            meals,
            orders,
            currentRestaurant,
            admintoken,
            adminId,
            addMeal,
            updateOrder,
            delOrder,
            delMeal,
            updateMeal,
        }}>
            {children}
        </ManageRestoAdminContext.Provider>
    )
}
