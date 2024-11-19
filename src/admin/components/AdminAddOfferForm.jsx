import React, { useState } from "react";
import {
  useAddOfferMutation,
  useLazyGetProdutsQuery,
} from "../../services/adminFethApi";

function AdminAddOfferForm({ closeModal,isEditing,setIsEditing }) {
  // ---- Mutations ---- //
  const [addOffer, { isLoading }] = useAddOfferMutation(); // mutation for add new category
  const [getProducts] = useLazyGetProdutsQuery();

  // ---- States ---- //
  const [offer, setOffer] = useState({
    offerName: "",
    offerType: "product",
    offerValue: "",
    targetId: "",
    startDate: "",
    endDate: "",
  });
  const [validateError, setValidateError] = useState("");
  const [items, setItems] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // ---- Functions ---- //

  // function to validate form
  function validate() {
    if (!offer?.offerName || offer.offerName.length === 0) {
      setValidateError("offer name is needed");
      return false;
    }
    if (!offer?.offerType || offer.offerType.length === 0) {
      setValidateError("Offer type is needed");
      return false;
    }
    if (!offer?.offerValue || offer.offerValue.length === 0) {
      setValidateError("Offer value is needed");
      return false;
    }
    if (!offer?.targetId || offer.targetId.length === 0) {
      setValidateError("Offer start date is needed");
      return false;
    }
    if (!offer?.startDate || offer.startDate.length === 0) {
      setValidateError("Offer start date is needed");
      return false;
    }
    if (!offer?.endDate || offer.endDate.length === 0) {
      setValidateError("Offer end date is needed");
      return false;
    }
    setValidateError("");
    return true;
  }

  // function to handdle form change
  function handleChange(e) {
    setOffer({
      ...offer,
      [e.target.name]: e.target.value,
    });
  }

  // function to handle submit of the form
  async function handleSubmit(e) {
    e.preventDefault();
    if(!validate())return;
    try {
      if (isEditing) {
        const response = await addOffer(offer).unwrap();
        if (response) {
          setOffer({
            offerName: "",
            offerType: "",
            offerValue: "",
            targetId: "",
            startDate: "",
            endDate: "",
          });
          setIsEditing(false);
        }
      } else {
        const response = await addOffer(offer).unwrap();
        if (response) {
          setOffer({ categoryName: "", description: "" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function productsFetch(e) {
    try {
      setDropdownVisible(true);
      const response = await getProducts({ query: e.target.value }).unwrap();
      if (response) {
        const productNames = response.data.map((product) => ({
          _id: product._id,
          name: product.productName,
        }));
        setItems(productNames);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handletargetId(itemId) {
    setOffer((prev) => ({
      ...prev,
      targetId: itemId,
    }));
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
          <h2>Offer Name</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="text"
            name="offerName"
            value={offer.offerName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Offer Type</h2>
          <div className="border border-black rounded-md px-5 py-2">
            <select
              name="offerType"
              onChange={handleChange}
              value={offer.offerType}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value="product">Product</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2>Offer Value(%)</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="text"
            name="offerValue"
            onChange={handleChange}
            value={offer.offerValue}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2>Applicable Items</h2>
          <div className="relative group">
            <input
              className="w-full border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
              placeholder="Search Products"
              type="text"
              onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
              onChange={productsFetch}
              value={offer.targetId}
            />
            {isDropdownVisible && (
              <div className="w-full px-3 max-h-[300px] overflow-hidden overflow-y-auto border border-black rounded-lg bg-white absolute flex flex-col gap-5">
                {items &&
                  items.map((item) => (
                    <span
                      key={item._id}
                      onClick={() => handletargetId(item._id)}
                      className="block hover:bg-[#dfdfdf] p-2 cursor-pointer"
                    >
                      {item.name}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2>Start Date</h2>
          <input
            className="border border-black rounded-md px-5 py-2 placeholder:text-[16px] placeholder:text-[#79767C] placeholder:font-thin"
            placeholder="Type Quantity here"
            type="date"
            name="startDate"
            onChange={handleChange}
            value={offer.startDate}
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
            value={offer.endDate}
          />
        </div>
        <button
          type="submit"
          className="w-full h-[60px] rounded-lg bg-black text-[27px] text-white"
        >
          {isEditing ? "Edit" : isLoading ? "Adding..." : "Add"}
        </button>
        {validateError && <span className="text-red-500">{validateError}</span>}
      </form>
    </div>
  );
}

export default AdminAddOfferForm;
