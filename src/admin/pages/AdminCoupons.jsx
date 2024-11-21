import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import AdminAddCoupons from "../components/AdminAddCoupons";
import Table from "../components/Table";
import { useGetCouponsQuery } from "../../services/adminFethApi";

function AdminCoupons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons,setCoupons] = useState([])

  // mutations
  const {data:couponsFetched} = useGetCouponsQuery();

  // table cofigs
  const columns = [
    "couponCode",
    "discountValue",
    "maxDiscount",
    "minPurchaseAmount",
    "usageLimit",
    "usedCount",
    "startDate",
    "endDate",
  ];

  const headings = [
    "Coupon Code",
    "Discount Value(%)",
    "Max Discount",
    "Min Amount",
    "Usage Limit",
    "Used Count",
    "Start Date",
    "End Date",
    "isActive",
    // "Action"
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
    // {
    //   label: "Edit",
    //   action: handleEdit,
    //   styles: "text-[25px]",
    //   icon: () => <i className="fas fa-edit"></i>,
    // },
  ];
  
  const mainButton = {
    name: "Add Coupns",
    action: () => {
      setIsModalOpen(true);
    },
  };

  // useeffects
  useEffect(() => {
    if(couponsFetched){
      setCoupons(couponsFetched.data)
    }
  },[couponsFetched])


  // functions
  // function to update status of the category
  async function handleStatus(coupon) {
   console.log('coupon :>> ', coupon);
  }


  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full  pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Coupon Management</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i> Coupons
            </span>
          </div>
        </div>
        <div className="p-10">
          <Table
            pageName="Coupons"
            headings={headings}
            data={coupons}
            columns={columns}
            buttonConfigs={buttonConfigs}
            mainButton={mainButton}
          />
        </div>
      </main>
      {isModalOpen && (
        <AdminAddCoupons closeModal={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default AdminCoupons;
