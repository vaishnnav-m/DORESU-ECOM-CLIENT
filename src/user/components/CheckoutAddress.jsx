import { useEffect, useState } from "react";
import { useAddAddressMutation, useUpdateAddressMutation } from "../../services/userProfile";
import { toast } from "react-toastify";

function CheckoutAddress({ closeModal, editingAddress, refetch }) {
  const [addAdress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isEditting }] = useUpdateAddressMutation();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingAddress) setFormData(editingAddress);
  }, [editingAddress]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let response
      if (editingAddress) {
        response = await updateAddress(formData).unwrap();
      } else {
        response = await addAdress(formData).unwrap();
      }
      if (response) {
        toast.success("address saved successfully", {
          position: "top-right",
          theme: "dark",
        });
        refetch();
        closeModal();
      }
    } catch (error) {
      toast.error("Unexpected error", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={() => closeModal()}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  name="mobile"
                  className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  type="text"
                  onChange={handleChange}
                  value={formData?.mobile || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  type="text"
                  onChange={handleChange}
                  value={formData?.pincode || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House No. / Building</label>
                <input
                  name="houseName"
                  className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  type="text"
                  onChange={handleChange}
                  value={formData?.houseName || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  name="landMark"
                  className="w-full h-[50px] rounded-xl border border-gray-300 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  type="text"
                  onChange={handleChange}
                  value={formData?.landMark || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="pt-4 sticky bottom-0 bg-white border-t border-gray-100 -mx-6 px-6 py-4 mt-2">
              <button
                type="submit"
                disabled={isAdding || isEditting}
                className="w-full h-[55px] rounded-xl bg-black text-white font-bold text-lg shadow-lg shadow-black/10 hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {(isAdding || isEditting) ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </span>
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutAddress;
