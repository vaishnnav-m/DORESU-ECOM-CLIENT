import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetProdutsQuery,
  useUpdateProductStatusMutation,
} from "../../services/adminFethApi";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

function AdminProducts() {
  const navigate = useNavigate();
  // hooks for mutation and query
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [getProducts] = useLazyGetProdutsQuery();
  // states
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [offset, setOffsetValue] = useState(0);
  const [hasMore,setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      const limit = 4;
      const products = await getProducts({ offset, limit }).unwrap();
      if (products) setData(products.data);
      if(products.data.length < limit){
        setHasMore(false)
      }else{
        setHasMore(true)
      }
    } catch (error) {
      setHasMore(false)
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [offset]);

  // for table
  const headings = [
    "Images",
    "Poduct Name",
    "Description",
    "Stock",
    "Price",
    "Availale",
    "update",
  ];
  const columns = ["productName", "description", "stock", "price"];
  const mainButton = {
    name: "Add Product",
    action: () => {
      navigate("/admin/addProducts");
    },
  };
  // for modal
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    isActive: null,
  });
  const [buttonConfigsModal, setButtonCofigsModal] = useState([]);

  // function to handle modal
  const handleModal = ({ _id, isActive }) => {
    setSelectedProduct({ id: _id, isActive: isActive });

    if (isActive) {
      setModalHeading("Unpublish Product");
      setModalText(
        "Are you sure to deactivate this product? If you deactivate it, users can't see the product."
      );
      setButtonCofigsModal([
        {
          name: "Cancel",
          action: () => setModal(false),
          styles: "px-4 py-2 bg-gray-200 text-sm mr-4 rounded-lg",
        },
        {
          name: "Continue",
          action: () => handleStatus(_id),
          styles: "px-4 py-2 text-sm mr-4 rounded-lg bg-red-500",
        },
      ]);
    } else {
      setModalHeading("Publish Product");
      setModalText(
        "Are you sure to activate this product? If you activate it, users can see the product."
      );
      setButtonCofigsModal([
        {
          name: "Cancel",
          action: () => setModal(false),
          styles: "px-4 py-2 bg-gray-200 text-sm mr-4 rounded-lg",
        },
        {
          name: "Continue",
          action: () => handleStatus(_id),
          styles: "px-4 py-2 text-sm mr-4 rounded-lg bg-green-500",
        },
      ]);
    }

    setModal(true);
  };

  const mainIcon = selectedProduct.isActive ? (
    <i className="fas fa-x text-3xl text-red-500"></i>
  ) : (
    <i className="fas fa-check text-3xl text-green-500"></i>
  );

  const buttonConfigs = [
    {
      label: "Toggle",
      action: handleModal,
      styles: "text-green-600 text-[30px]",
      icon: (isActive) => (
        <i className={`fas ${isActive ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
      ),
    },
    {
      label: "Edit",
      action: handleEdit,
      styles: "text-[25px]",
      icon: () => <i className="fas  fa-edit"></i>,
    },
  ];

  // function to handleStatus
  async function handleStatus(_id) {
    try {
      const response = await updateProductStatus({ productId: _id }).unwrap();
      if (response) {
        setModal(false);
        toast.success("Product Updated !", {
          position: "top-right",
          theme: "dark",
        });
        return true;
      }
    } catch (error) {
      toast.error("Product update failed.", {
        position: "top-right",
        theme: "dark",
      });
      console.log(error);
    }
  }

  // function to handle edit
  function handleEdit(product) {
    navigate(`/admin/editProduct/${product._id}`);
  }
  const [updatedData, setUpdatedData] = useState([]);
  useEffect(() => {
    if (data) {
      const mappedData = data.map((item) => ({
        _id: item._id,
        productName: item.productName,
        description: item.description,
        stock: item.variants[0]?.stock || 0,
        price: item.variants[0]?.price || 0,
        isActive: item.isActive,
        gallery: item.gallery,
      }));
      setUpdatedData(mappedData);
    }
  }, [data]);

  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Products</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i> Products
            </span>
          </div>
        </div>
        <div className="p-10">
          <Table
            pageName={"Product Management"}
            data={updatedData}
            headings={headings}
            columns={columns}
            buttonConfigs={buttonConfigs}
            imageConfigs={true}
            mainButton={mainButton}
          />
          <div className="flex justify-center pt-2">
            <div className="bg-white">
              <button className={`px-5 py-2 border-[2px] ${!offset && "hidden"}`} onClick={() => setOffsetValue((prev) => prev-4)}><i className="fas fa-arrow-left"/></button>
              <button className="px-5 py-2 border-[2px]">{(offset/4)+1}</button>
              <button className={`px-5 py-2 border-[2px] ${!hasMore && "hidden"}`} onClick={() => setOffsetValue((prev) => prev+4)}><i className="fas fa-arrow-right"/></button>
            </div>
          </div>
        </div>
      </main>
      {modal && (
        <ConfirmModal
          text={modalText}
          heading={modalHeading}
          buttonConfigs={buttonConfigsModal}
          mainIcon={mainIcon}
        />
      )}
    </div>
  );
}

export default AdminProducts;
