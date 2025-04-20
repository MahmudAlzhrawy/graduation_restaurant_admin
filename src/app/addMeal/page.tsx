import AddMeal from "@/components/AddMealForm";
import { Suspense } from "react";
export default function MealAdd(){
    return (
        <Suspense fallback={<h2>Loading.........</h2>}>
            <AddMeal/>
        </Suspense>
    )
}