import React from "react";
import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import AddressForm from "../components/AddressForm";

function EditAddress() {
  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="w-[70%] flex gap-10">
        <div className="w-[340px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center border rounded-lg gap-10 px-10 py-5 flex-1">
          <h2 className="text-[20px] font-bold">Edit Address</h2>
          <AddressForm />
        </div>
      </main>
    </div>
  );
}

export default EditAddress;
