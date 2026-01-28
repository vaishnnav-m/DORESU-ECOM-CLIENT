import React, { useEffect, useState } from "react";
import UserProfileAside from "../components/UserProfileAside";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateDefaultAddressMutation,
} from "../../services/userProfile";
import UserConfirmModal from "../components/UserConfirmModal";

function Address() {
  const navigate = useNavigate();
  const { data, refetch } = useGetAddressesQuery();
  const [updateDefaultAddress, { data: updateData }] =
    useUpdateDefaultAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [addresses, setAddresses] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [buttonConfigsModal, setButtonCofigsModal] = useState([]);

  const mainIcon = <i className="fas fa-x text-red-500 text-3xl"></i>;

  useEffect(() => {
    if (data) {
      setAddresses(data.data);
      console.log(addresses);
    }
  }, [data]);

  const handleIsDefault = async (addressId) => {
    try {
      console.log(addressId);
      const response = await updateDefaultAddress({ addressId }).unwrap();
      if (response) {
        toast.success("Address updated successfully", {
          position: "top-right",
          theme: "dark",
        });
        refetch();
      }
    } catch (error) {
      toast.error("Unexpected error", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const response = deleteAddress({ addressId }).unwrap();
      if (response) {
        await refetch();
        toast.success("Address deleted successfully", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Unexpected error", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  // function to handle modal
  const handleModalOpen = (addressId) => {
    setModalHeading("Change Order Status");
    setModalText(
      "Are you sure to delete the address.If you delete this you can't retrieve it"
    );
    setButtonCofigsModal([
      {
        name: "Cancel",
        action: () => setModal(false),
        styles: "px-4 py-2  bg-gray-200 text-sm mr-4 rounded-lg",
      },
      {
        name: "Continue",
        action: () => {
          handleDelete(addressId);
          setModal(false);
        },
        styles:
          "px-4 py-2 bg-red-200 text-red-900 text-sm mr-4 rounded-lg border",
      },
    ]);
    setModal(true);
  };

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
              <div className="flex flex-col gap-6">
                 <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                     <h2 className="text-2xl font-bold text-gray-900">Manage Addresses</h2>
                 </div>
                 
                <button
                  onClick={() => navigate("/profile/addAddress")}
                  className="w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all px-8 py-6 text-lg font-bold text-gray-500 hover:text-black flex items-center justify-center gap-3"
                >
                  <i className="fas fa-plus"></i>
                  Add A New Address
                </button>

                <div className="flex flex-col gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="w-full p-6 border border-gray-200 rounded-xl hover:border-black transition-colors bg-white relative group"
                    >
                      {address.isDefault && (
                        <div className="absolute top-4 right-4">
                            <span className="bg-black text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Default</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1 mb-4">
                          <div className="flex items-center gap-3">
                             <h3 className="font-bold text-lg text-gray-900">{address.name}</h3>
                             <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">{address.mobile}</span>
                          </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-6">
                          {[address.houseName, address.street, address.city, address.district, address.state, address.pincode].filter(Boolean).join(", ")}
                      </p>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/profile/editAddress/${address._id}`)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        
                        {!address.isDefault && (
                          <>
                            <button
                                onClick={() => handleIsDefault(address._id)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-black hover:text-black transition-colors"
                            >
                                Set as Default
                            </button>
                            <button
                                onClick={() => handleModalOpen(address._id)}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors ml-auto sm:ml-0"
                            >
                                Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <UserConfirmModal
          text={modalText}
          heading={modalHeading}
          buttonConfigs={buttonConfigsModal}
          mainIcon={mainIcon}
        />
      )}
    </div>
  );
}

export default Address;
