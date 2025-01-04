import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/Doresu.svg";
import Profile from "../assets/Shopicons_Filled_Account.svg";
import Cart from "../assets/Shopicons_Filled_Cart5.svg";
import Search from "../assets/Vector.svg";
import Tshirt from "../assets/black-t-shirt-is-hanging-hanger-with-word-dope-it_1340-38184-removebg-preview.png";
import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../../services/authApi";
import { logOut } from "../../store/authSlice";
import { SearchContext } from "../store/context";

function Header() {
  const [authenticated, setAuthenticated] = useState();
  const [inputVisible, setInputVisible] = useState(false);
  const { query, setQuery } = useContext(SearchContext);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  // selecter for user authenticated
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // logout mutation hook
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  // useffect to set updated authenticated
  useEffect(() => {
    setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    () => {
      clearTimeout(timer);
    };
  }, [showButton]);

  function handleLogout() {
    dispatch(logOut());
    return logoutUser();
  }
  if (isLoading) return <p>Loading...</p>;
  return (
    <header className="md:h-[100px] h-[60px] w-full fixed top-0 z-[9999]">
      <nav className="w-full h-full flex justify-between items-center xl:px-[100px] 2xl:px-[200px] lg:px-[30px] md:px-10 px-5 bg-gradient-to-b from-[#D9D9D9] to-white">
        <div className="flex md:gap-5 gap-[9px] items-center">
          <div className="relative">
            <img
              className="xl:w-[200px] md:w-[150px] w-[90px]"
              src={Logo}
              alt=""
            />
            <img
              className="animate-shirt lg:w-[40px] w-[35px] md:block absolute right-0 lg:top-1/2 top-[47%] hidden"
              src={Tshirt}
              alt=""
            />
          </div>
        </div>

        <div>
          <ul
            className={`lg:flex gap-10 lg:gap-6 ${
              inputVisible && "lg:-translate-x-10"
            } text-[#6e6e6e] text-[18px] hidden font-sans font-semibold`}
          >
            <li className="custm-underline">
              <Link className={location.pathname === "/" && "active"} to="/">
                Home
              </Link>
            </li>
            <li className="custm-underline">
              <Link
                className={location.pathname === "/all" && "active"}
                to="/all"
              >
                All Products
              </Link>
            </li>
            <li className="custm-underline">
              <Link className={location.pathname === "/about" && "active"}>
                About
              </Link>
            </li>
            <li className="custm-underline">
              <Link className={location.pathname === "/contactus" && "active"}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <ul className="flex items-center md:gap-10 lg:gap-6 gap-5 text-[#6e6e6e] text-[18px] font-sans font-semibold">
            {location.pathname === "/all" && (
              <li className="flex gap-2 relative ">
                {inputVisible && (
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="md:max-w-[160px] max-w-[100px] absolute md:right-7 right-4 -translate-y-1  md:translate-y-[7px] px-1 border-b border-b-black bg-transparent focus:outline-none"
                    type="text"
                  />
                )}
                <img
                  onClick={() => setInputVisible(!inputVisible)}
                  className="xl:w-[25px] lg:w-[20px] md:w-[18px] w-[16px]"
                  src={Search}
                  alt=""
                />
              </li>
            )}
            <li className="hover:scale-110 hidden lg:flex lg:flex-col relative group">
              <button>
                <img className="xl:w-[25px] w-[20px]" src={Profile} alt="" />
              </button>
              <ul className="w-[200px] absolute z-50 top-[25px] text-center left-1/2 -translate-x-1/2 -translate-y-[30px] bg-white shadow-xl opacity-0 pointer-events-none hover:opacity-100 group-hover:translate-y-0 group-focus:translate-y-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-all duration-300 ease-in-out">
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
              <Link to="/cart">
                <img
                  className="xl:w-[25px] lg:w-[20px] md:w-[20px] w-[18px]"
                  src={Cart}
                  alt="cart"
                />
              </Link>
            </li>
            <li className="hover:scale-110">
              <Link to="/wishList">
                <i className="fas fa-heart xl:text-[22px] lg:text-[20px] md:text-[18px] text-[16px] text-black" />
              </Link>
            </li>
            <li className="flex gap-2">
              <div className="lg:hidden">
                <i
                  onClick={() => {
                    setIsMenuVisible((prev) => !prev);
                    isMenuVisible ? setShowButton(false) : setShowButton(true);
                  }}
                  className="fas fa-bars text-[#484848] md:text-[20px] text-[16px]"
                ></i>
                <ul
                  style={
                    isMenuVisible
                      ? { pointerEvents: "all" }
                      : { pointerEvents: "none" }
                  }
                  className="flex overflow-hidden w-[150px] items-center flex-col gap-1 bg-transparent text-[#6e6e6e] absolute right-2 font-sans font-semibold"
                >
                  <li
                    className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                      isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                    } transform transition-all duration-[500ms] ease-in-out`}
                  >
                    <Link to="/">Home</Link>
                  </li>
                  <li
                    className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                      isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                    } transform transition-all duration-[550ms] ease-in-out`}
                  >
                    <Link to="/all">All Products</Link>
                  </li>
                  {authenticated && (
                    <li
                      className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                        isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                      } transform transition-all duration-[600ms] ease-in-out`}
                    >
                      <Link to="/profile">Profile</Link>
                    </li>
                  )}
                  {!authenticated && (
                    <li
                      className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                        isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                      } transform transition-all duration-[650ms] ease-in-out`}
                    >
                      <Link to="/login">Login</Link>
                    </li>
                  )}
                  <li
                    className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                      isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                    } transform transition-all duration-[700ms] ease-in-out`}
                  >
                    <Link>About</Link>
                  </li>
                  <li
                    className={`bg-white w-full py-3 px-3 rounded-lg shadow-lg ${
                      isMenuVisible ? "translate-x-0" : "translate-x-[100%]"
                    } transform transition-all duration-[750ms] ease-in-out`}
                  >
                    <Link>Contact Us</Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          {!authenticated && !isMenuVisible && (
            <div
              className={`lg:hidden md:right-16 md:px-5 px-4 md:text-[1.13rem] text-[0.9rem] py-2 absolute right-6 bg-white shadow-lg ${
                showButton ? "opacity-1 scale-100" : "opacity-0 scale-50"
              } transform transition-all duration-300 ease-in-out`}
            >
              <span className="font-semibold text-md">
                {" "}
                <Link to="/login">Login</Link>
              </span>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
