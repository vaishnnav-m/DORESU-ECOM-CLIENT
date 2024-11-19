import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/authSlice";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../services/authApi";

function OtpForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { userId } = useParams();
  const [timer, setTimer] = useState(59);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // verify OTP mutation
  const [
    verifyOtp,
    { isLoading: isVerifyLoading, isError: isVerifyError, error: verifyError },
  ] = useVerifyOtpMutation();

  // resend OTP mutation
  const [
    resendOtp,
    {
      isSuccess: isResendSuccess,
      isError: isResendError,
      error: resendError,
    },
  ] = useResendOtpMutation();

  // useffect for otp timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer((prevTimer) => prevTimer - 1);
      else clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // function to handle otp submit
  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    try {
      const response = await verifyOtp({ userId, otp }).unwrap();
      if (response && response.accessToken) {
        if(response.status === 200){
          setOtp("");
          setError("");
          localStorage.setItem('userToken',response.accessToken);
          dispatch(setCredentials(response.accessToken));
        }
        return navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError("");
      await resendOtp({ userId }).unwrap();
      setTimer(59);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="min-w-[700px] flex flex-col gap-9 pr-[70px]">
      <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative text-right">
        <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
          OTP
        </span>
        <input
          onChange={(e) =>{
            setError("") 
            setOtp(e.target.value)
          }}
          value={otp}
          name="text"
          aria-autocomplete="false"
          className="w-full h-full rounded-lg px-5"
          type="text"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {timer > 0 && timer + " s"}
        </span>
        <button
          disabled={timer > 0}
          onClick={handleResendOtp}
          className={`text-[16px] mr-1 font-medium focus:outline-none ${
            timer > 0 ? "text-gray-400" : "text-black"
          }`}
        >
          Resend OTP
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
      >
        {isVerifyLoading ? "Submiting..." : "Submit"}
      </button>
      {error && <span className="text-red-500">{error}</span>}
      {isVerifyError && (
        <span className="text-red-500">
          {verifyError?.data?.message || "otp Verify failed"}
        </span>
      )}

      {isResendError && (
        <span className="text-red-500">
          {resendError?.data?.message || "Failed to resend OTP"}
        </span>
      )}

      {isResendSuccess && (
        <span className="text-green-500">A new otp has send to your mail</span>
      )}
    </div>
  );
}

export default OtpForm;
