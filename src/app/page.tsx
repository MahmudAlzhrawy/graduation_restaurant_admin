import LoginPage from "@/components/LoginFrom";
import { ManageRestoAdminProvider } from "./Context/ManageRestoOwnerContext";

export default function Login(){
  
  return (

    <ManageRestoAdminProvider>
      <LoginPage/>
    </ManageRestoAdminProvider>
  )
}