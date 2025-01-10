import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import leftImage from "../assets/LeftImage.png";
import { useForgotPasswordMutation } from "../../services/authApi";

function ForgotPasswordReset() {
  // mutation for reset password
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { userId } = useParams();
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateSchema = Yup.object({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "password should be atleast 8 characters")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Passwor must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password should contain atleast one lowercase letter"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Password must match")
      .required("Confirm Password is required"),
  });

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        userId,
      }));
      await validateSchema.validate(formData ,{ abortEarly: false });

      const response = await forgotPassword(formData).unwrap();
      if (response) {
        setError({});
        navigate("/login");
        toast.success("Password updated successfully", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (errors) {
      console.log(errors)
      if (errors.inner) {
        const newErrors = {};
        errors.inner.forEach((error) => {
          return (newErrors[error.path] = error.message);
        });
        return setError(newErrors);
      }
      toast.error(errors.data.message, {
        position: "top-right",
        theme: "dark",
      });
      setError({});
    }
  }

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${leftImage})` }}
      >
        <h1
          className="text-[63px] text-white font-bold"
          style={{ fontFamily: "Volkhov" }}
        >
          DORESU
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-32 px-[50px] pt-[80px]">
        <div>
          <h2 className="font-medium text-[50px] text-[#212121]">
            Reset Your Password
          </h2>
          <span className="font-medium text-[18] text-[#737373]">
            Create a strong, secure password to protect your account
          </span>
        </div>
        <div className="flex flex-col gap-6 items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative">
              <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
                Password
              </span>
              <input
                className="w-full h-full rounded-lg px-5"
                type="password"
                name="newPassword"
                value={formData?.newPassword}
                onChange={handleChange}
              />
            </div>

            {error.newPassword && (
              <span className="text-red-600">{error.newPassword}</span>
            )}
            <div className="w-full border border-[#8A8A8A] rounded-lg h-[60px] relative">
              <span className="bg-white px-[20px] py-[12] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
                Confirm password
              </span>
              <input
                className="w-full h-full rounded-lg px-5"
                type="password"
                name="confirmPassword"
                value={formData?.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {error.confirmPassword && (
              <span className="text-red-600">{error.confirmPassword}</span>
            )}
            <button
              type="submit"
              className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
            >
              {isLoading ? "Updating" : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordReset;
