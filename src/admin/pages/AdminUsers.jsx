import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import { useGetUsersQuery, useUpdateUserMutation } from "../../services/adminFethApi";

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
  const buttonConfigs = [
    {
      label: "Toggle",
      action: handleBlock,
      styles:"text-green-600 text-[30px]",
      icon: (isActive) => (
        <i className={`fas ${isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
      ),
    }
  ];

  const [updateUser] = useUpdateUserMutation();

  async function handleBlock(userId) {
    try {
      const response = await updateUser({ userId });
      if (response) {
       return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#E7E7E3] flex h-screen">
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
    </div>
  );
}
export default AdminUsers;
