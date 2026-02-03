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
  const { data: addressData, refetch } = useGetOneAddressQuery(addressId, { skip: !addressId }) // fetching the address
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const navigate = useNavigate();

  // usEffect to set the address to formdata
  useEffect(() => {
    if (addressData)
      setFormData(addressData.data)
  }, [addressData])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (addressId) {
        const response = await updateAddress(formData).unwrap();
        if (response)
          navigate('/profile/address')
      } else {
        const response = await addAddress(formData).unwrap();
        if (response) {
          toast.success(`Address ${addressId ? "edited" : "added"} successfully`, {
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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      {/* Name */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          name="name"
          className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          type="text"
          placeholder="e.g. John Doe"
          onChange={handleChange}
          value={formData?.name || ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            name="mobile"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            placeholder="10-digit mobile number"
            onChange={handleChange}
            value={formData?.mobile || ""}
          />
        </div>
        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            name="pincode"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            placeholder="6-digit pincode"
            onChange={handleChange}
            value={formData?.pincode || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House No. / Building Name</label>
          <input
            name="houseName"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            onChange={handleChange}
            value={formData?.houseName || ""}
          />
        </div>
        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
          <input
            name="landMark"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            placeholder="Near..."
            onChange={handleChange}
            value={formData?.landMark || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street / Area</label>
          <input
            name="street"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            onChange={handleChange}
            value={formData?.street || ""}
          />
        </div>
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
          <input
            name="city"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            onChange={handleChange}
            value={formData?.city || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <input
            name="district"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            onChange={handleChange}
            value={formData?.district || ""}
          />
        </div>
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            name="state"
            className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="text"
            onChange={handleChange}
            value={formData?.state || ""}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || isUpdating}
          className="w-full h-[55px] rounded-xl bg-black text-white font-bold text-lg shadow-lg shadow-black/10 hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {(isLoading || isUpdating) ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i> Saving...
            </span>
          ) : (
            addressId ? "Update Address" : "Save Address"
          )}
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
