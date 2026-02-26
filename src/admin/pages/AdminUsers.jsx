import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import { useGetUsersQuery, useUpdateUserMutation } from "../../services/adminFethApi";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import Table from "../components/Table";

function AdminUsers() {
  const { data } = useGetUsersQuery();
  const headings = [
    "User Name",
    " Phone",
    " Email",
    "IsActive",
  ];
  const columns = ["firstName", "phone", "email"];
  const [updateUser] = useUpdateUserMutation();

  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: null,
    isActive: null,
  });
  const [buttonConfigsModal, setButtonCofigsModal] = useState([]);

  const handleModal = (user) => {
    setSelectedUser({ id: user._id, isActive: user.isActive });

    if (user.isActive) {
      setModalHeading("Block User");
      setModalText(
        "Are you sure you want to block this user? If blocked, the user will not be able to log in or make purchases."
      );
      setButtonCofigsModal([
        {
          name: "Cancel",
          action: () => setModal(false),
          styles: "px-4 py-2 bg-gray-200 text-sm mr-4 rounded-lg",
        },
        {
          name: "Continue",
          action: () => handleBlock(user._id),
          styles: "px-4 py-2 text-sm mr-4 rounded-lg bg-red-500",
        },
      ]);
    } else {
      setModalHeading("Unblock User");
      setModalText(
        "Are you sure you want to unblock this user? If unblocked, the user will regain access to their account."
      );
      setButtonCofigsModal([
        {
          name: "Cancel",
          action: () => setModal(false),
          styles: "px-4 py-2 bg-gray-200 text-sm mr-4 rounded-lg",
        },
        {
          name: "Continue",
          action: () => handleBlock(user._id),
          styles: "px-4 py-2 text-sm mr-4 rounded-lg bg-green-500",
        },
      ]);
    }
    setModal(true);
  };

  const mainIcon = selectedUser.isActive ? (
    <i className="fas fa-user-lock text-3xl text-red-500"></i>
  ) : (
    <i className="fas fa-user-check text-3xl text-green-500"></i>
  );

  const buttonConfigs = [
    {
      label: "Toggle",
      action: handleModal,
      styles: "text-green-600 text-[30px]",
      icon: (isActive) => (
        <i className={`fas ${isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
      ),
    }
  ];

  async function handleBlock(userId) {
    try {
      const response = await updateUser({ userId }).unwrap();
      if (response) {
        setModal(false);
        toast.success("User status updated successfully", {
          position: "top-right",
          theme: "dark",
        });
        return true;
      }
    } catch (error) {
      toast.error("User status update failed", {
        position: "top-right",
        theme: "dark",
      });
      console.log(error);
    }
  }

  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Customers</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i>{" "}
              Customers
            </span>
          </div>
        </div>
        <div className="p-10">
          <Table
            pageName="User Management"
            headings={headings}
            data={data && data}
            columns={columns}
            buttonConfigs={buttonConfigs}
          />
        </div>
      </main>
      {modal && (
        <ConfirmModal
          text={modalText}
          heading={modalHeading}
          buttonConfigs={buttonConfigsModal}
          mainIcon={mainIcon}
        />
      )}
    </div>
  );
}
export default AdminUsers;
