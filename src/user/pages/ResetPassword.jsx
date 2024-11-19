import Header from "../components/Header";
import ResetPasswordForm from "../components/ResetPasswordForm";
import UserProfileAside from "../components/UserProfileAside";

function ResetPassword() {
  return (
   <div className="pt-[200px] flex justify-center">
   <Header />
   <main className="w-[70%] flex gap-10">
     <UserProfileAside/>
     <div className="flex flex-col items-center border px-10 py-5 flex-1">
       <h2 className="text-[20px] font-bold ">Reset Password</h2>
       <ResetPasswordForm/>
     </div>
   </main>
 </div>
  )
}

export default ResetPassword