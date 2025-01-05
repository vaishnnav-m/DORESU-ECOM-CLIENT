import React from "react";
import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import AddressForm from "../components/AddressForm";

function AddAddress() {
  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
      <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center border rounded-lg gap-10 xl:px-10 px-5 py-5 flex-1">
          <h2 className="text-[20px] font-bold">Add Address</h2>
          <AddressForm/>
        </div>
      </main>
    </div>
  );
}

export default AddAddress;
