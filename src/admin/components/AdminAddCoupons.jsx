import React, { useEffect, useState } from "react";
import {
  useAddCouponMutation,
  useEditCouponsMutation,
} from "../../services/adminFethApi";
import { toast } from "react-toastify";


function AdminAddCoupons({ closeModal, editing }) {
  const [addCoupon, { isLoading }] = useAddCouponMutation();
  const [editCoupon, { isLoading: isEditing }] = useEditCouponsMutation();

  const [coupon, setCoupon] = useState({
    couponCode: "",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
  });
  const [validateError, setValidateError] = useState("");

  useEffect(() => {
    if (editing)
      setCoupon({
        ...editing,
        startDate: new Date(editing.startDate).toISOString().split("T")[0],
        endDate: new Date(editing.endDate).toISOString().split("T")[0],
      });
  }, [editing]);

  // function to handdle form change
  function handleChange(e) {
    setCoupon({
      ...coupon,
      [e.target.name]: e.target.value,
    });
  }

  // function to validate form
  function validate() {
    if (!coupon?.couponCode.trim() || coupon.couponCode.length === 0) {
      setValidateError("coupon code is needed");
      return false;
    }
    if (!coupon?.discountValue || coupon.discountValue.length === 0) {
      setValidateError("Discount value is needed");
      return false;
    }
    if (
      !coupon?.minPurchaseAmount ||
      coupon.minPurchaseAmount.length === 0
    ) {
      setValidateError("Minimum purchase is needed");
      return false;
    }
    if (!coupon?.maxDiscount || coupon.maxDiscount.length === 0) {
      setValidateError("Max Discount is needed");
      return false;
    }
    if (!coupon?.usageLimit || coupon.usageLimit.length === 0) {
      setValidateError("Usage Limit is needed");
      return false;
    }
    if (!coupon?.startDate || coupon.startDate.length === 0) {
      setValidateError("startDate is needed");
      return false;
    }
    if (!coupon?.endDate || coupon.endDate.length === 0) {
      setValidateError("endDate is needed");
      return false;
    }
    setValidateError("");
    return true;
  }

  // function to handle submit of the form
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      let response;
      if (editing) {
        console.log(coupon);
        response = await editCoupon({...coupon,couponId:coupon._id}).unwrap();
      } else {
        response = await addCoupon(coupon).unwrap();
      }
      if (response) {
        toast.success(response.message, {
          position: "top-right",
          theme: "dark",
        });
        closeModal();
      }
    } catch (error) {
      toast.error(error.data.message, {
        position: "top-right",
        theme: "dark",
      });
    }
  }
  
  return (
    <div className="absolute inset-0 z-[999] bg-[#00000077] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="min-w-[700px] h-fit rounded-xl gap-5 p-20 bg-white flex flex-col justify-center relative"
      >
        <button
          className="absolute top-3 right-3 w-fit px-3 py-2 border rounded-lg"
          type="button"
          onClick={() => closeModal()}
        >
          Close
        </button>
        <div className="flex flex-col gap-2">
          <h2>Coupon Code</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type code here"
            type="text"
            name="couponCode"
            value={coupon.couponCode}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Discount Value(%)</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Disxount here"
            type="number"
            name="discountValue"
            onChange={handleChange}
            value={coupon.discountValue}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Minimum purchase amount</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="number"
            name="minPurchaseAmount"
            onChange={handleChange}
            value={coupon.minPurchaseAmount}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Max Discount</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="number"
            name="maxDiscount"
            onChange={handleChange}
            value={coupon.maxDiscount}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Usage Limit</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="number"
            name="usageLimit"
            onChange={handleChange}
            value={coupon.usageLimit}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Start Date</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="date"
            name="startDate"
            onChange={handleChange}
            value={coupon.startDate}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>End Date</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="date"
            name="endDate"
            onChange={handleChange}
            value={coupon.endDate}
          />
        </div>
        <button
          type="submit"
          className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
        >
          {isLoading || isEditing ? "Saving..." : "Save"}
        </button>
        {validateError && <span className="text-red-500">{validateError}</span>}
      </form>
    </div>
  );
}

export default AdminAddCoupons;
