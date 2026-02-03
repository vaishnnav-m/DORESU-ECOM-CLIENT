import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import AddressForm from "../components/AddressForm";

function AddAddress() {
  const location = useLocation();
  return (
    <div className="pt-[200px] flex justify-center">
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
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{location.pathname.includes("edit") ? "Edit Address" : "Add New Address"}</h2>
              </div>
              <AddressForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAddress;
