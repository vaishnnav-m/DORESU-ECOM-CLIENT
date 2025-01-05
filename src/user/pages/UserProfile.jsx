import React from "react";
import Header from "../components/Header";
import ProfileForm from "../components/ProfileForm";
import UserProfileAside from "../components/UserProfileAside";

function UserProfile() {
  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
        <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center border px-10 py-5 flex-1">
          <h2 className="text-[20px] font-bold ">Profile Information</h2>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
