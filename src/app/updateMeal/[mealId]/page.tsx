import { ManageRestoAdminProvider } from "@/app/Context/ManageRestoOwnerContext";
import UpdateMeal from "@/components/UpdateMeal";
import { Suspense } from "react";
interface prop{
    params:{
        mealId:number
    }
}
export default   function MealUpdate({params}:prop){
    const mealId =   params.mealId
    return(
        <ManageRestoAdminProvider>

        <Suspense>
            <UpdateMeal mealId={mealId}/>
        </Suspense>
        </ManageRestoAdminProvider>
    )
}