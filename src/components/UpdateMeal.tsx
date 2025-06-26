"use client";
import { ManageRestoAdminContext } from "@/app/Context/ManageRestoOwnerContext";
import Link from "next/link";
import { useFormik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { FaArrowLeft } from "react-icons/fa";
export default function UpdateMeal({mealId}:{mealId:number}) {
const { updateMeal } = useContext(ManageRestoAdminContext);

const formik = useFormik({
initialValues: {
    MealName: '',
    Description: '',
    MealImage: null,
    Price: 0,
    CategoryId: 0,
},
validationSchema: Yup.object().shape({
    MealName: Yup.string().required("This field is required"),
    Description: Yup.string().required("This field is required"),
    MealImage: Yup.string().required("This field is required"),
    Price: Yup.number().required("This field is required"),
    CategoryId: Yup.number().required("This field is required"),
}),
onSubmit:async (values,{resetForm}) => {
  
    await updateMeal(values,mealId);
    console.log("submitted form");
    resetForm();
},
});

return (
<div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
    <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-gray-200">
    <Link
          href="/dashboard"
          className="inline-flex items-center mb-6 text-sm font-medium text-gray-600 hover:text-black transition"
        >
          <FaArrowLeft className="mr-2" />
          Back to Meals
        </Link>

    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Meal</h2>
    <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
        <input
            type="text"
            {...formik.getFieldProps("MealName")}
            placeholder="Meal Name"
            className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {formik.touched.MealName && formik.errors.MealName && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.MealName}</div>
        )}
        </div>

        <div>
        <input
            type="text"
            {...formik.getFieldProps("Description")}
            placeholder="Description"
            className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {formik.touched.Description && formik.errors.Description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.Description}</div>
        )}
        </div>

        <div>
        <input
                type="file"
                name="MealImage"
                onChange={(event) => {
                    formik.setFieldValue("MealImage", event.currentTarget.files?.[0]);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formik.touched.MealImage && formik.errors.MealImage && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.MealImage}</div>
            )}

        </div>

        <div>
        <input
            type="number"
            {...formik.getFieldProps("Price")}
            placeholder="Price"
            className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {formik.touched.Price && formik.errors.Price && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.Price}</div>
        )}
        </div>

        <div>
        <select
            name="CategoryId"
            value={formik.values.CategoryId}
            onChange={(e) => formik.setFieldValue("CategoryId", Number(e.target.value))}
            onBlur={formik.handleBlur}
            className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        >
            <option value={0} disabled>Select Category</option>
            <option value={1}>Grill</option>
            <option value={2}>Egyptian</option>
            <option value={3}>Pizza</option>
            <option value={4}>Seafood</option>
            <option value={5}>Desserts</option>
        </select>
        {formik.touched.CategoryId && formik.errors.CategoryId && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.CategoryId}</div>
        )}
        </div>

        <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition duration-300"
        >
        Submit
        </button>
    </form>
    </div>
</div>
);
}
