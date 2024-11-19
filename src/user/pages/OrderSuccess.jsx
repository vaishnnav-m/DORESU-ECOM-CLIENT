import React from "react";
import Header from "../components/Header";
import successIcon from "../assets/success-green-check-mark-icon 1.svg";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
   const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-[200px]">
      <Header />
      <main className="w-[60%] border rounded-xl flex justify-center py-10 px-10">
        <div className="text-2xl flex flex-col items-center gap-5 max-w-[50%] text-center">
         <img className="w-[100px]" src={successIcon} alt="" />
          <h1 className="font-bold">Your order is Completed</h1>
          <span className="text-[20px]">
            Thank You for your order. Your order is getting processed We will
            update your order status through mail
          </span>
          <button
            className="bg-[black] text-white px-5 py-2 rounded-full mt-5"
            onClick={() => navigate("/all")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;
