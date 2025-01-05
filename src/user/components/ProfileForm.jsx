import React, { useEffect, useState } from "react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../services/userProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import UserConfirmModal from "../components/UserConfirmModal";

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [buttonConfigsModal, setButtonCofigsModal] = useState([]);

  const mainIcon = <i className="fas fa-question text-3xl"></i>;

  useEffect(() => {
    setFormData({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      email: user?.email,
    });
    setIsPasswordVisible(!user?.googleId);
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
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

  if (isLoading) {
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

  // function to handle modal
  const handleModalOpen = () => {
    setModalHeading("Confirm Changes to Your Details");
    setModalText("You are about to update your profile details. Are you sure you want to proceed?");
    setButtonCofigsModal([
      {
        name: "Cancel",
        action: () => setModal(false),
        styles: "px-4 py-2  bg-gray-200 text-sm mr-4 rounded-lg",
      },
      {
        name: "Continue",
        action: () => {
          handleSubmit();
          setModal(false);
        },
        styles: "px-4 py-2 text-sm mr-4 rounded-lg border",
      },
    ]);
    setModal(true);
  };

  return (
    <>
      <form className="flex flex-col gap-5 w-full">
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
        {isPasswordVisible && (
          <>
            <label className="text-18px font-semibold">Password</label>
            <div className="w-full border text-right  border-[#8A8A8A] h-[50px] rounded relative">
              <input
                name="password"
                value="********"
                className="w-full h-full rounded px-5"
                type="password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => navigate(`/profile/resetPassword/${user._id}`)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 items-center cursor-pointer"
              >
                <i className="fas fa-pen text-[14px] "></i>
                <span>Edit</span>
              </button>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleModalOpen}
          className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
        >
          {isFormSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
      {modal && (
        <UserConfirmModal
          text={modalText}
          heading={modalHeading}
          buttonConfigs={buttonConfigsModal}
          mainIcon={mainIcon}
        />
      )}
    </>
  );
}

export default ProfileForm;
