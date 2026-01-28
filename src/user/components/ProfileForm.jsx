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
      <form className="flex flex-col gap-6 w-full">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">First Name</label>
                <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors bg-white"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData?.firstName}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Last Name</label>
                <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors bg-white"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData?.lastName}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                    type="email"
                    name="email"
                    defaultValue={formData?.email}
                    disabled
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors bg-white"
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData?.phone}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* Password Section */}
        {isPasswordVisible && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <div className="relative w-full">
              <input
                name="password"
                value="********"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white pr-20"
                type="password"
                disabled
              />
              <button
                type="button"
                onClick={() => navigate(`/profile/resetPassword/${user._id}`)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium text-black bg-gray-100 rounded hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                <i className="fas fa-pen text-xs"></i>
                <span>Edit</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
            <button
            type="button"
            onClick={handleModalOpen}
            className="w-full md:w-auto px-8 h-12 rounded-lg bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
            {isFormSubmitting ? (
                 <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Updating...</span>
                 </>
            ) : "Update Profile"}
            </button>
        </div>
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
