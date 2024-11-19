import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Doresu.svg";

function Aside() {
  const location = useLocation();
  return (
    <aside className="w-[260px] min-h-full z-50 fixed py-9 px-9 flex flex-col items-center gap-9 bg-white">
      <div className="w-[160px]">
        <img className="w-full pointer-events-none" src={logo} alt="" />
      </div>
      <nav className="w-full">
        <ul className="uppercase text-[14px] tracking-wide text-[#232321] font-semibold *:py-[12px] *:px-[17px] *:rounded-lg transition-all ease-in duration-300">
          <li
            className={
              location.pathname === "/admin" ? "bg-black text-white" : ""
            }
          >
            <Link to="/admin">Dashboard</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/users" ? "bg-black text-white" : ""
            }
          >
            <Link to="/admin/users">Customers</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/products"
                ? "bg-black text-white"
                : ""
            }
          >
            <Link to="/admin/products">All Products</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/orders" ? "bg-black text-white" : ""
            }
          >
            <Link to="/admin/orders">Order List</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/cupons" ? "bg-black text-white" : ""
            }
          >
            <Link to="/admin/cupons">Cupons</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/offers" ? "bg-black text-white" : ""
            }
          >
            <Link to="/admin/offers">Offers</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/catagories"
                ? "bg-black text-white"
                : ""
            }
          >
            <Link to="/admin/catagories">Catagories</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Aside;
