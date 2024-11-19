import { useEffect, useState } from "react";
import EyeBtn from "../assets/Group.svg";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSignupUserMutation } from "../../services/authApi";
import GoogleAuth from "./GoogleAuth";

function SignupForm() {
  // states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const [
    signupUser,
    { data, isLoading, isError, isSuccess, error: authError },
  ] = useSignupUserMutation();

  // form validation area
  const validateSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Invalid email format"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required(),
    password: Yup.string()
      .required("Password is required")
      .min(8, "password should be atleast 8 characters")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Passwor must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password should contain atleast one lowercase letter"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password must match")
      .required("Confirm Password is required"),
  });

  // function to handdle submit of the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validateSchema.validate(formData, { abortEarly: false });
      await signupUser(formData).unwrap();
      setError({});
    } catch (errors) {
      if (errors.inner) {
        const newErrors = {};
        errors.inner.forEach((error) => {
          return (newErrors[error.path] = error.message);
        });
        return setError(newErrors);
      }
      setError({});
    }
  };
  useEffect(() => {
    if (isSuccess && data?.userId) {
      navigate(`/verifyOtp/${data?.userId}`);
    }
  }, [isSuccess, data?.userId, navigate]);

  // function to handle change
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-w-[630px]">
      <form
        onSubmit={handleSubmit}
        className="min-w-[700px] flex flex-col gap-9 "
      >
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              First Name
            </span>
            <input
              name="firstName"
              value={formData.firstName}
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={onChange}
            />
            {error.firstName && (
              <span className="text-red-600">{error.firstName}</span>
            )}
          </div>
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Last Name
            </span>
            <input
              name="lastName"
              value={formData.lastName}
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={onChange}
            />
            {error.lastName && (
              <span className="text-red-600">{error.lastName}</span>
            )}
          </div>
        </div>

        <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
          <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Email
          </span>
          <input
            name="email"
            value={formData.email}
            className="w-full h-full rounded-lg px-5"
            type="email"
            onChange={onChange}
          />
          {error.email && <span className="text-red-600">{error.email}</span>}
        </div>
        <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
          <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Phone
          </span>
          <input
            name="phone"
            value={formData.phone}
            className="w-full h-full rounded-lg px-5 "
            type="phone"
            onChange={onChange}
          />
          {error.phone && <span className="text-red-600">{error.phone}</span>}
        </div>
        <div className="w-full border text-right  border-[#8A8A8A] h-[55px] rounded-lg relative">
          <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Password
          </span>
          <input
            name="password"
            value={formData.password}
            className="w-full h-full rounded-lg px-5"
            type="password"
            onChange={onChange}
          />
          {error.password && (
            <span className="text-red-600">{error.password}</span>
          )}
          <img
            className="absolute right-3 top-1/2 -translate-y-1/2"
            src={EyeBtn}
            alt=""
          />
        </div>
        <div className="w-full border text-right  border-[#8A8A8A] h-[55px] rounded-lg relative">
          <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
            Confirm Password
          </span>
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            className="w-full h-full rounded-lg px-5"
            type="password"
            onChange={onChange}
          />
          {error.confirmPassword && (
            <span className="text-red-600">{error.confirmPassword}</span>
          )}
          <img
            className="absolute right-3 top-1/2 -translate-y-1/2"
            src={EyeBtn}
            alt=""
          />
        </div>

        <button
          type="submit"
          className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
        >
          {isLoading ? "Singning up..." : "Signup"}
        </button>
        {isError && (
          <span className="text-red-500">
            {authError?.data?.message || "Signup failed"}
          </span>
        )}

        {isSuccess && (
          <span className="text-green-500">Signup successful!</span>
        )}
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

export default SignupForm;
