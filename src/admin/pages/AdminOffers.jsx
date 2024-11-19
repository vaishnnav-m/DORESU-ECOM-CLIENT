import React, { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import Table from "../components/Table";
import {
  useGetOffersQuery,
  useUpdateOfferStatusMutation,
} from "../../services/adminFethApi";
import AdminAddOfferForm from "../components/AdminAddOfferForm";

function AdminOffers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offer,setOffer] = useState(null);

  // Table Config
  const columns = [
    "offerName",
    "offerType",
    "offerValue",
    "startDate",
    "endDate",
  ];
  const headings = [
    "Offer Name",
    "Offer Type",
    "Offer Value(%)",
    "Start Date",
    "End Date",
    "isActive",
    "Action"
  ];
  const buttonConfigs = [
    {
      label: "Toggle",
      action: handleStatus,
      styles: "text-green-600 text-[30px]",
      icon: (isActive) => (
        <i className={`fas ${isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
      ),
    },
    {
      label: "Edit",
      action: handleEdit,
      styles: "text-[25px]",
      icon: () => <i className="fas fa-edit"></i>,
    },
  ];
  const mainButton = {
    name: "Add Offer",
    action: () => {
      setIsModalOpen(true);
    },
  };

  // ---- Mutations ---- //
  const { data } = useGetOffersQuery(); // to get categories
  const [updateOfferStatus] = useUpdateOfferStatusMutation(); // to update status of category

  // ---- Functions ---- //

  // function to update status of the category
  async function handleStatus(offer) {
    try {
      const offerId = offer._id;
      const response = await updateOfferStatus({ offerId }).unwrap();
      if (response) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to handleEditing
  function handleEdit(offer) {
    const confirmEdit = window.confirm(
      "Are you sure you want to edit this category?"
    );
    if (confirmEdit) {
      setIsEditing(true);
      setOffer(offer);
    }
  }

  useEffect(() => {
    if (data) {
      const updated = data.data.map((item) => {
        const startDate = new Date(item.startDate).toISOString().split("T")[0];
        const endDate = new Date(item.endDate).toISOString().split("T")[0];

        return {
          ...item,
          offerValue:item.offerValue+"%",
          startDate,
          endDate,
        };
      });
      setOffers(updated);
    }
  }, [data]);

  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full  pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Offer Management</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i> offers
            </span>
          </div>
        </div>
        <div className="p-10">
          <Table
            pageName="Offers"
            headings={headings}
            data={offers}
            columns={columns}
            buttonConfigs={buttonConfigs}
            mainButton={mainButton}
          />
        </div>

        {isModalOpen && (
          <AdminAddOfferForm closeModal={() => setIsModalOpen(false)} />
        )}
      </main>
    </div>
  );
}

export default AdminOffers;
