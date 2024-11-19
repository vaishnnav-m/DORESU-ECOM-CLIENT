import React from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";

function AdminAddCatagories() {
  return (
    <div className="bg-[#E7E7E3] flex min-h-screen">
      <Aside />
      <main className="w-full  pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Add Product</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i> Products
            </span>
          </div>

          <div className="p-10 h-full flex justify-center items-center">
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAddCatagories;
