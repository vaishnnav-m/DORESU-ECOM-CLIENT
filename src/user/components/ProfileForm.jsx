import React, { useEffect, useState } from "react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../services/userProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

function ProfileForm() {
  const { data: user, isLoading, error: userError } = useGetUserQuery();
  const [updateUser, { isLoading: isFormSubmitting }] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      email: user?.email,
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(formData).unwrap();
      if (response) {
        toast.success("Profile updated successfully", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Unexpected error", {
         position: "top-right",
         theme: "dark",
       });
    }
  };

  if(isLoading){
    return (
      <div className="w-full min-h-screen flex justify-center items-center ">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          strokeColor="black"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperClass="stroke-black"
        />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <label className="text-18px font-semibold">Name</label>
      <div className="flex gap-5">
        <input
          className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
          type="text"
          name="firstName"
          value={formData?.firstName}
          onChange={handleChange}
        />
        <input
          className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
          type="text"
          name="lastName"
          value={formData?.lastName}
          onChange={handleChange}
        />
      </div>
      <label className="text-18px font-semibold">Email</label>
      <input
        className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
        type="email"
        name="email"
        defaultValue={formData?.email}
        disabled
      />
      <label className="text-18px font-semibold">Phone</label>
      <input
        className="rounded border border-[#8a8a8a] px-5 py-3 w-full"
        type="text"
        name="phone"
        value={formData?.phone}
        onChange={handleChange}
      />
      <label className="text-18px font-semibold">Password</label>
      <div className="w-full border text-right  border-[#8A8A8A] h-[50px] rounded relative">
        <input
          name="password"
          value="********"
          className="w-full h-full rounded px-5"
          type="password"
          onChange={handleChange}
        />
        <button type="button" onClick={() => navigate(`/profile/resetPassword/${user._id}`)} className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 items-center cursor-pointer">
          <i className="fas fa-pen text-[14px] "></i>
          <span>Edit</span>
        </button>
      </div>
      <button
        type="submit"
        className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
      >
        {isFormSubmitting?"Updating...":"Update"}
      </button>
    </form>
  );
}

export default ProfileForm;
