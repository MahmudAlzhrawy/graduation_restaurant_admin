import { ManageRestoAdminProvider } from "@/app/Context/ManageRestoOwnerContext";
import UpdateMeal from "@/components/UpdateMeal";
import { Suspense } from "react";
export default function MealUpdate({ params }) {
  const mealId = parseInt(params.mealId, 10);

  return (
    <ManageRestoAdminProvider>
      <Suspense>
        <UpdateMeal mealId={mealId} />
      </Suspense>
    </ManageRestoAdminProvider>
  );
}
