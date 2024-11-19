import React, { useEffect, useState } from "react";

function CheckoutAddress({ closeModal, address, setAddress }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (address) setFormData(address);
  }, [address]);

  function handleChange(e){
   setFormData((prev) => ({
      ...prev,
      [e.target.name]:e.target.value
   }))
  }

  function handleSubmit(){
   setAddress(formData);
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0000006c]">
      <div className="w-full max-w-[70%] flex justify-end">
        <button
          onClick={() => closeModal()}
          className="bg-black text-white px-5 py-3 translate-y-14 -translate-x-5 rounded-full"
        >
          <i className="fas fa-x" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-[70%] rounded-xl px-10 py-20 flex flex-col gap-9 bg-white ">
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Name
            </span>
            <input
              name="name"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.name || ""}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Mobile
            </span>
            <input
              name="mobile"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.mobile || ""}
            />
          </div>
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Pincode
            </span>
            <input
              name="pincode"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.pincode || ""}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              House name
            </span>
            <input
              name="houseName"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.houseName || ""}
            />
          </div>
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Landmark(Optional)
            </span>
            <input
              name="landMark"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.landMark || ""}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              Street
            </span>
            <input
              name="street"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.street || ""}
            />
          </div>
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              City
            </span>
            <input
              name="city"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.city || ""}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              District
            </span>
            <input
              name="district"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.district || ""}
            />
          </div>
          <div className="w-full border border-[#8A8A8A] rounded-lg h-[55px] relative">
            <span className="bg-white px-[20px] text-center text-[#737373] absolute left-5 top-0 -translate-y-[50%]">
              State
            </span>
            <input
              name="state"
              className="w-full h-full rounded-lg px-5"
              type="text"
              onChange={handleChange}
              value={formData?.state || ""}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full h-[55px] rounded-lg bg-black text-[27px] text-white"
        >
          save
        </button>
      </form>
    </div>
  );
}

export default CheckoutAddress;
