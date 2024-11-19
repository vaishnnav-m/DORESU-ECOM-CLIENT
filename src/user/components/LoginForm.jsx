import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Google from "../assets/Google.svg";
import EyeBtn from "../assets/Group.svg";
import { useLoginUserMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import GoogleAuth from "./GoogleAuth";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loginUser, { isLoading, isError, isSuccess, error: authError }] =
    useLoginUserMutation();
  const dispatch = useDispatch();

  // function to handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await loginUser(formData).unwrap();
      if (response && response.accessToken) {
        localStorage.setItem("userToken",response.accessToken);
        dispatch(setCredentials(response.accessToken));
        return navigate("/");
      }
    } catch (error) {
      console.log("error is :", error);
    }
  };

  // function to handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="min-w-[630px]">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-9"
      >
        <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative">
          <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Email
          </span>
          <input
            onChange={handleChange}
            value={formData.email}
            name="email"
            className="w-full h-full rounded-lg px-5"
            type="email"
          />
        </div>

        <div className="w-full border text-right border-[#8A8A8A] h-[60px] rounded-lg relative">
          <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Password
          </span>
          <input
            onChange={handleChange}
            value={formData.password}
            name="password"
            className="w-full h-full rounded-lg  px-5 mb-1"
            type="password"
          />
          <img
            className="absolute right-3 top-1/2 -translate-y-1/2"
            src={EyeBtn}
            alt=""
          />
          <span className="text-[#737373] text-[17px] font-medium">
            Forgot Password ?
          </span>
        </div>

        <button
          type="submit"
          className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {isError && (
          <span className="text-red-500">
            {authError?.data?.message || "Login failed"}
          </span>
        )}

        {isSuccess && <span className="text-green-500">Login successful!</span>}
      </form>
      <div className="bg-[#bbbbbb] h-[1px] relative my-10">
        <span className="text-[#8A8A8A] font-semibold absolute left-1/2 -translate-y-1/2 bg-white p-2">
          OR
        </span>
      </div>
      <GoogleAuth />
    </div>
  );
}

export default LoginForm;
