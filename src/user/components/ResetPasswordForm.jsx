import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/userProfile";
import { toast } from "react-toastify";
import * as Yup from "yup";


function ResetPasswordForm() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { userId } = useParams();
  const [error,setError] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      userId
    }))
    try {
      await validateSchema.validate(formData, { abortEarly: false });
      const response = await resetPassword(formData).unwrap();
      if(response){
        setError({});
        navigate('/profile')
        toast.success("Password updated successfully", {
          position: "top-right",
          theme: "dark",
        });
        
      }
    } catch (errors) {
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
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <label className="text-18px font-semibold">Old Password</label>
      <input
        className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
        type="password"
        name="oldPassword"
        value={formData?.oldPassword}
        onChange={handleChange}
      />

      <label className="text-18px font-semibold">New Password</label>
      <input
        className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
        type="password"
        name="newPassword"
        value={formData?.newPassword}
        onChange={handleChange}
      />
      {error.newPassword && (
        <span className="text-red-600">{error.newPassword}</span>
      )}
      <label className="text-18px font-semibold">Confirm Password</label>
      <input
        className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
        type="password"
        name="confirmPassword"
        value={formData?.confirmPassword}
        onChange={handleChange}
      />
      {error.confirmPassword && (
        <span className="text-red-600">{error.confirmPassword}</span>
      )}
      <button
        type="submit"
        className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
      >
        {isLoading ? "" : "Update"}
      </button>
    </form>
  );
}

export default ResetPasswordForm;
