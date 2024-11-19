import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAddAddressMutation, useGetOneAddressQuery, useUpdateAddressMutation } from "../../services/userProfile";
import { useNavigate, useParams } from "react-router-dom";

function AddressForm() {
  const [addAddress, { isLoading }] = useAddAddressMutation();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    houseName: "",
    landMark: "",
    city: "",
    district: "",
    street: "",
    state: "",
  });
  // if editing
  const { addressId } = useParams();
  const { data: addressData,refetch } = useGetOneAddressQuery(addressId,{skip:!addressId}) // fetching the address
  const [updateAddress,{isLoading:isUpdating}] = useUpdateAddressMutation();
  const navigate = useNavigate();

  // usEffect to set the address to formdata
  useEffect(() => {
    if(addressData)
      setFormData(addressData.data)
  },[addressData])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(addressId){
       const response = await updateAddress(formData).unwrap();
        if(response)
          navigate('/profile/address')
      }else{
       const response = await addAddress(formData).unwrap();
       if (response) {
         toast.success(`Address ${addressId?"edited":"added"} successfully`, {
           position: "top-right",
           theme: "dark",
         });
         setFormData({
           name: "",
           mobile: "",
           pincode: "",
           houseName: "",
           landMark: "",
           city: "",
           district: "",
           street: "",
           state: "",
         });
       }
      }
    } catch (error) {
      toast.error("Unexpected error", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-10 flex flex-col gap-9 ">
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
        {(isLoading || isUpdating) ? "Saving..." : addressId ? "Update " : "Add "}
      </button>
    </form>
  );
}

export default AddressForm;
