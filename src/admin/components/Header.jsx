import { useDispatch } from "react-redux";
import { useLogoutAdminMutation } from "../../services/adminFethApi";
import { adminLogOut } from "../../store/authSlice";

function Header() {

  const [logoutAdmin] = useLogoutAdminMutation();
  const dispatch = useDispatch();

  function handleLogout() {
      dispatch(adminLogOut());
      return logoutAdmin();
  }

  return (
    <header className="h-[96px] fixed z-40 top-0 inset-0 max-w-full bg-white flex-1 flex justify-end items-center">
      <ul className="flex items-center gap-9 pr-7">
        <li className="flex gap-2  ">
          {/* <input
          className="max-w-[160px] absolute right-7  translate-y-[7px] px-1 border-b border bg-transparent focus:outline-none"
          type="text"
        /> */}
          <i className="fa-solid fa-magnifying-glass"></i>
        </li>
        <li>
          <i className="fa-solid fa-bell"></i>
        </li>
        <li className="flex gap-2 relative">
          <span className="p-2 border rounded-md font-semibold tracking-wide text-[14px] uppercase ">
            admin
            <i className="fa-solid fa-angle-down ml-3"></i>
          </span>
          <div className="absolute bottom-0 translate-y-12 bg-white shadow-lg">
            <button onClick={() => handleLogout()} className="px-5 py-2 text-[20px]">Logout</button>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Header;
