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
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
        <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center border rounded-lg gap-10 xl:px-10 px-5 py-5 flex-1">
          <h2 className="text-[20px] font-bold">Manage Addresses</h2>
          <div className="w-full">
            <button
              onClick={() => navigate("/profile/addAddress")}
              className="w-full rounded-lg border-2  px-10 py-5 text-[18px] uppercase font-semibold text-start"
            >
              <i className="fas fa-plus mr-3"></i>Add a new address
            </button>
          </div>
          {addresses.map((address) => (
            <div
              key={address._id}
              className="w-full px-10 py-5 border-2 rounded-lg flex flex-col gap-5"
            >
              {address.isDefault && (
                <h2 className="text-[18px] font-semibold">Default Address</h2>
              )}
              <div className="text-[17px] font-semibold text-[#484848]">
                <span className="mr-5">{address.name}</span>
                <span>{address.mobile}</span>
                <div className="text-[16px] text-[#8A8A8A]">
                  <span>
                    {address.houseName +
                      "," +
                      address.street +
                      "," +
                      address.city +
                      "," +
                      address.district +
                      "," +
                      address.state +
                      "," +
                      address.pincode}
                  </span>
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                {!address.isDefault && (
                  <button
                    onClick={() => handleIsDefault(address._id)}
                    className="px-5 py-3 border rounded-lg"
                  >
                    Set As Default
                  </button>
                )}
                <button
                  onClick={() =>
                    navigate(`/profile/editAddress/${address._id}`)
                  }
                  className="px-5 py-3 border rounded-lg"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleModalOpen(address._id)}
                    className="px-5 py-3 bg-black rounded-lg text-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
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
