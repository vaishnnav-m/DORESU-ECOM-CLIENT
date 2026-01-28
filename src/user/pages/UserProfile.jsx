import React from "react";
import Header from "../components/Header";
import ProfileForm from "../components/ProfileForm";
import UserProfileAside from "../components/UserProfileAside";

function UserProfile() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 md:pt-40 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3 sticky top-32 z-10">
             <UserProfileAside />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Profile Information
              </h2>
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
