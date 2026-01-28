import { useEffect, useState } from "react";
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
  const [showPassword,setShowPassword] = useState(false);
  const [showCPassword,setShowCPassword] = useState(false);

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
      [e.target.name]: e.target.value.trim(),
    });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
            <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent"
              type="text"
              onChange={onChange}
              placeholder="First Name"
            />
            {error.firstName && (
              <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.firstName}</span>
            )}
          </div>
          <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
            <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent"
              type="text"
              onChange={onChange}
              placeholder="Last Name"
            />
            {error.lastName && (
              <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.lastName}</span>
            )}
          </div>
        </div>

        <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
          <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent"
            type="email"
            onChange={onChange}
            placeholder="example@mail.com"
          />
          {error.email && <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.email}</span>}
        </div>

        <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
          <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent"
            type="tel"
            onChange={onChange}
            placeholder="10 digit mobile number"
          />
          {error.phone && <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.phone}</span>}
        </div>

        <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
          <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
            Password
          </label>
          <input
            name="password"
            value={formData.password}
            className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent pr-10"
            type={showPassword ? "text" : "password"}
            onChange={onChange}
            placeholder="Create a password"
          />
          <button
             type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
             <i className={`far fa-${showPassword ? "eye-slash" : "eye"}`}></i>
          </button>
           {error.password && (
            <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.password}</span>
          )}
        </div>

        <div className="w-full border border-gray-300 rounded-lg relative focus-within:border-black transition-colors">
          <label className="bg-white px-2 text-xs font-medium text-gray-500 absolute left-3 -top-2">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            className="w-full h-12 rounded-lg px-4 outline-none text-gray-900 bg-transparent pr-10"
            type={showCPassword ? "text" : "password"}
            onChange={onChange}
            placeholder="Re-enter password"
          />
          <button
             type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowCPassword((prev) => !prev)}
          >
             <i className={`far fa-${showCPassword ? "eye-slash" : "eye"}`}></i>
          </button>
           {error.confirmPassword && (
            <span className="absolute -bottom-5 left-1 text-xs text-red-500">{error.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-12 mt-4 rounded-lg bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md flex items-center justify-center"
          disabled={isLoading}
        >
           {isLoading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Create Account"
          )}
        </button>
        
        {isError && (
          <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100 text-center">
            {authError?.data?.message || "Signup failed"}
          </div>
        )}

        {isSuccess && (
          <div className="p-3 bg-green-50 text-green-500 text-sm rounded-md border border-green-100 text-center">Signup successful!</div>
        )}
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <GoogleAuth />
    </div>
  );
}

export default SignupForm;
