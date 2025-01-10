import { useState } from "react";
import { useGetOtpMutation } from "../../services/authApi";
import { useNavigate } from "react-router-dom";

function ForgotPassworEmail({ closeModal }) {
  // mutations
  const [getOtp,{isLoading}] = useGetOtpMutation();
  
  // states
  const [email,setEmail] = useState('');

  // navigation
  const navigate = useNavigate();

  // function to check validity fo the email
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // function to handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValid = validateEmail(email);
      if(!isValid)
        return setErrorMessage("Please enter a valid email");
      const response = await getOtp({email}).unwrap();
      if (response ) {
        navigate(`/verifyForgotOtp/${response.userId}`)
      }
    } catch (error) {
      console.log("error is :", error);
    }
  };

  return (
    <>
      <div className="bg-white w-[700px] flex flex-col relative gap-12 px-20 py-20 rounded-xl">
        <button
          className="absolute top-3 right-3 w-fit px-3 py-2 border rounded-lg"
          type="button"
          onClick={() => closeModal()}
        >
          Close
        </button>
        <div className="flex flex-col gap-3">
          <h1 className="text-[20px] font-bold">Forgot Password?</h1>
          <span className="text-[#505050]">
            Please enter the email address associated with your account. We’ll
            send you an otp.
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative text-right">
            <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Email
            </span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className="w-full h-full rounded-lg px-5"
              type="text"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
          >
           {isLoading ?'Submiting..' :'Submit'} 
          </button>
          {/* {isResendSuccess && (
        <span className="text-green-500">A new otp has send to your mail</span>
      )} */}
        </div>
      </div>
    </>
  );
}

export default ForgotPassworEmail;
