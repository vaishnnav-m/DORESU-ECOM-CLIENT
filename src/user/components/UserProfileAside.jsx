import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UserProfileAside() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-col fixed gap-10">
      <div className="w-full border flex gap-5 px-5 py-2 rounded-lg">
        <div className="px-4 py-3 rounded-full  bg-[#eaeaea]">
          <i className="far fa-user text-xl"></i>
        </div>
        <div>
          <span className="font-semibold text-[18px] block">User</span>
          <span className="text-[#8a8a8a]">user@gmail.com</span>
        </div>
      </div>
      <div className="w-full h-full border px-8 py-3 text-[#8a8a8a] rounded-lg">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-8 cursor-pointer  border-b py-5"
          style={{color:location.pathname === '/profile' && "black"}}
        >
          <i className="fas fa-user text-xl text-black"></i>
          <span className="font-semibold text-[20px]">Account Settings</span>
        </button>
        <button
          onClick={() => navigate("/profile/address")}
          className="w-full flex items-center gap-8 cursor-pointer border-b py-5"
          style={{color:location.pathname === '/profile/address' && "black"}}
        >
          <i className="fas fa-address-book text-xl text-black"></i>
          <span className="font-semibold text-[20px]">Manage Addresses</span>
        </button>
        <button
          onClick={() => navigate("/profile/orders")}
          className="w-full flex items-center gap-8 cursor-pointer border-b py-5"
          style={{color:location.pathname === '/profile/orders' && "black"}}
        >
          <i className="fas fa-bag-shopping text-xl text-black"></i>
          <span className="font-semibold text-[20px]">My Orders</span>
        </button>
        <button
          onClick={() => navigate("/wallet")}
          className="w-full flex items-center gap-8 cursor-pointer border-b py-5"
          style={{color:location.pathname === '/wallet' && "black"}}
        >
          <i className="fas fa-wallet text-xl text-black"></i>
          <span className="font-semibold text-[20px]">My Wallet</span>
        </button>
        <button className="w-full flex items-center gap-8 cursor-pointer py-5">
          <i className="fas fa-right-from-bracket text-xl text-black"></i>
          <span className="font-semibold text-[20px]">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default UserProfileAside;
