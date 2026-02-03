import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../../store/authSlice";
import { useLogoutUserMutation } from "../../services/authApi";

function UserProfileAside() {
  const [logoutUser] = useLogoutUserMutation();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logOut());
    return logoutUser();
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
            <i className="far fa-user text-xl"></i>
          </div>
          <div className="overflow-hidden">
            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider block mb-0.5">Hello,</span>
            <span className="font-bold text-gray-900 text-lg truncate block">User</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex flex-col">
            {[
              { path: "/profile", icon: "user", label: "Account Settings" },
              { path: "/profile/address", icon: "address-book", label: "Addresses" },
              { path: "/profile/orders", icon: "bag-shopping", label: "My Orders" },
              { path: "/profile/wallet", icon: "wallet", label: "My Wallet" },
            ].map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 border-b border-gray-50 last:border-0
                              ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}
                          `}
                >
                  <div className={`w-8 flex justify-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    <i className={`fas fa-${item.icon} text-lg`}></i>
                  </div>
                  <span className={`font-medium text-base ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  {isActive && <i className="fas fa-chevron-right ml-auto text-xs"></i>}
                </button>
              )
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-left text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <div className="w-8 flex justify-center text-red-500">
                <i className="fas fa-right-from-bracket text-lg"></i>
              </div>
              <span className="font-medium text-base">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
        <div className="flex gap-3 min-w-max pb-2">
          {[
            { path: "/profile", icon: "user", label: "Profile" },
            { path: "/profile/address", icon: "map-marker-alt", label: "Addresses" },
            { path: "/profile/orders", icon: "box", label: "Orders" },
            { path: "/profile/wallet", icon: "wallet", label: "Wallet" },
          ].map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border
                            ${isActive
                    ? 'bg-black text-white border-black ring-2 ring-black/10'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }
                        `}
              >
                <i className={`fas fa-${item.icon} ${isActive ? 'text-white' : 'text-gray-400'}`}></i>
                {item.label}
              </button>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-white text-red-500 border border-gray-200 hover:bg-red-50"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default UserProfileAside;
