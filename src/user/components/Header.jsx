import React, { useEffect, useState } from "react";
import Logo from "../assets/Doresu.svg";
import Profile from "../assets/Shopicons_Filled_Account.svg";
import Cart from "../assets/Shopicons_Filled_Cart5.svg";
import Search from "../assets/Vector.svg";
import Tshirt from "../assets/black-t-shirt-is-hanging-hanger-with-word-dope-it_1340-38184-removebg-preview.png";
import "./header.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../../services/authApi";
import { logOut } from "../../store/authSlice";

function Header() {
  const [authenticated, setAuthenticated] = useState();
  const dispatch = useDispatch();
  // selecter for user authenticated
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // logout mutation hook
  const [logoutUser, { isLoading, isError, error, isSuccess }] =
    useLogoutUserMutation();
  // useffect to set updated authenticated
  useEffect(() => {
    setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  function handleLogout() {
    dispatch(logOut());
    return logoutUser();
  }
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error :{error.message}</p>;
  return (
    <header className="h-[100px] w-full fixed top-0 z-[9999]">
      <nav className="w-full h-full flex justify-between items-center lg:px-[100px] md:px-10 bg-gradient-to-b from-[#D9D9D9] to-white">
        <div className="flex justify-between">
          <div className="relative">
            <img className="lg:w-[200px] w-[150px] " src={Logo} alt="" />
            <img
              className="animate-shirt w-[40px] absolute right-0 top-1/2"
              src={Tshirt}
              alt=""
            />
          </div>
        </div>

        <div>
          <ul className="flex gap-10 text-[#6e6e6e] text-[18px] font-sans font-semibold">
            <li className="hover:scale-110">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:scale-110">
              <Link to="/all">All Products</Link>
            </li>
            <li className="hover:scale-110">
              <Link>About</Link>
            </li>
            <li className="hover:scale-110">
              <Link>Contact Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <ul className="flex gap-10 text-[#6e6e6e] text-[18px] font-sans font-semibold">
            <li className="flex gap-2 relative ">
              <input
                className="hidden max-w-[160px] absolute right-7  translate-y-[7px] px-1 border-b border-b-black bg-transparent focus:outline-none"
                type="text"
              />
              <img className="w-[25px]" src={Search} alt="" />
            </li>
            <li className="hover:scale-110 relative group">
              <button>
                <img className="w-[25px]" src={Profile} alt="" />
              </button>
              <ul className="w-[200px] absolute z-50 top-[30px] text-center left-1/2 -translate-x-1/2 -translate-y-[30px] bg-white shadow-xl opacity-0 pointer-events-none hover:opacity-100 group-hover:translate-y-0 group-focus:translate-y-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-all duration-300 ease-in-out">
                <li className="hover:bg-[#ececec] py-2 cursor-pointer">
                  {authenticated ? (
                    <Link to="/profile">Profile</Link>
                  ) : (
                    <Link to="/signup">Sinup</Link>
                  )}
                </li>
                <li className="hover:bg-[#ececec] py-2 cursor-pointer">
                  {authenticated ? (
                    <button onClick={handleLogout}>Logout</button>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </li>
              </ul>
            </li>
            <li className="hover:scale-110">
              <Link to="/wishList">
                <i className="fas fa-heart text-[22px] text-black"/>
              </Link>
            </li>
            <li className="hover:scale-110">
              <Link to="/cart">
                <img className="w-[25px]" src={Cart} alt="" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
