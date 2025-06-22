import Rate from "@/components/Rateings";
import { ManageRestoAdminProvider } from "../Context/ManageRestoOwnerContext";

export default function Reviews(){
    return(
        <ManageRestoAdminProvider>
        <Rate/>
        </ManageRestoAdminProvider>
    )
}