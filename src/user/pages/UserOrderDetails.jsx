import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateOrderStatusMutation,
  useGetOneOrderQuery,
  useLazyDownloadInvoiceQuery,
} from "../../services/userProfile";
import { useVerifyOrderMutation } from "../../services/userProductsApi";

import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import UserConfirmModal from "../components/UserConfirmModal";

function UserOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, refetch } = useGetOneOrderQuery(orderId);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyOrder] = useVerifyOrderMutation();
  const [downloadInvoice] = useLazyDownloadInvoiceQuery();

  // states
  const [orderData, setOrderData] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [buttonConfigsModal, setButtonConfigsModal] = useState([]);

  const mainIcon = <i className="fas fa-question text-3xl text-gray-400"></i>;

  useEffect(() => {
    if (data) setOrderData(data.data);
  }, [data]);

  // function to create date
  function createDate(timeStamp) {
    if (!timeStamp) return "";
    const date = new Date(timeStamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // function to handle update status
  async function handleUpdateStatus(orderId, itemId, status) {
    try {
      const response = await updateOrderStatus({
        orderId,
        itemId,
        status,
      }).unwrap();
      if (response) {
        toast.success(`Order ${status === "Cancelled" ? "Cancelled" : "Return Initiated"}`, {
          position: "top-right",
          theme: "dark",
        });
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  // STATUS STYLING
  function getStatusStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Returned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  // function to handle modal
  const handleModalOpen = (orderId, itemId, status) => {
    const actionType = status === "Cancelled" ? "Cancel" : "Return";

    setModalHeading(`${actionType} Order Item`);
    setModalText(`Are you sure you want to ${actionType.toLowerCase()} this item?`);

    setButtonConfigsModal([
      {
        name: "Go Back",
        action: () => setModal(false),
        styles: "px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors",
      },
      {
        name: `Yes, ${actionType}`,
        action: () => {
          handleUpdateStatus(orderId, itemId, status);
          setModal(false);
        },
        styles: "px-4 py-2 bg-black text-white hover:bg-gray-800 text-sm font-medium rounded-lg transition-colors",
      },
    ]);
    setModal(true);
  };

  async function repayment() {
    if (!orderData) return;
    const { razorpayOrderId, totalPrice } = orderData;
    const options = {
      key: "rzp_test_fbT8KO8CYacXGs",
      amount: totalPrice * 100,
      currency: "INR",
      name: "DORESU",
      description: "Retry Order Payment",
      order_id: razorpayOrderId,
      handler: async (paymentResponse) => {
        try {
          const response = await verifyOrder({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          }).unwrap();

          if (response) {
            navigate("/success");
          }
        } catch (error) {
          toast.error("Payment Verification Failed", {
            position: "top-right",
            theme: "dark",
          });
        }
      },
      prefill: {
        name: orderData?.shippingAddress?.name || "Customer",
        contact: orderData?.shippingAddress?.mobile || "9999999999",
      },
      theme: {
        color: "#000000",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handleDownloadInvoice() {
    try {
      const response = await downloadInvoice(orderId).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    }
  }

  return (
    <div className="pt-[100px] min-h-screen bg-gray-50/50 pb-12">
      <Header />

      <main className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb / Title Area - Mobile Only if needed, otherwise spacing */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500">ID: {orderData?.orderId || orderData?._id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3 sticky top-32 z-10">
            <UserProfileAside />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-9 flex flex-col gap-6">
            {!orderData ? (
              <div className="flex items-center justify-center p-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-gray-400">Loading order details...</span>
              </div>
            ) : (
              <>
                {/* Header Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-900 hidden lg:block">Order Details</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>Placed on <span className="font-medium text-gray-900">{createDate(orderData.createdAt)}</span></span>
                      <span className="hidden sm:inline">•</span>
                      <span>Order ID: <span className="font-medium text-gray-900">{orderData.orderId || orderData._id}</span></span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadInvoice}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
                  >
                    <i className="fas fa-download text-xs"></i>
                    <span>Invoice</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900">Items in this Order</h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {orderData.items.map((item) => (
                      <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full sm:w-28 h-28 sm:h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                          <img
                            src={item.gallery[0]}
                            alt={item.productId.productName}
                            className="w-full h-full object-contain mix-blend-multiply p-2"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">
                                {item.productId.productName}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">Size: <span className="font-medium text-gray-900">{item.size}</span></p>
                              <p className="text-sm text-gray-500">Qty: <span className="font-medium text-gray-900">{item.quantity}</span></p>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                              <span className="font-bold text-lg text-gray-900">₹{item.price}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end pt-2">
                            {item.status === "Delivered" ? (
                              <button
                                onClick={() => handleModalOpen(orderData._id, item._id, "Returned")}
                                className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-semibold hover:bg-orange-200 transition-colors"
                              >
                                Return Item
                              </button>
                            ) : (
                              !["Cancelled", "Returned"].includes(item.status) && (
                                <button
                                  onClick={() => handleModalOpen(orderData._id, item._id, "Cancelled")}
                                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                  Cancel Item
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Grid (Shipping & Payment) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600 flex flex-col gap-1 leading-relaxed">
                      <span className="font-bold text-gray-900 text-base">{orderData.shippingAddress.name}</span>
                      <span>{orderData.shippingAddress.street}</span>
                      <span>{orderData.shippingAddress.district}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}</span>
                      <span>India</span>
                      <span className="mt-2 font-medium text-gray-900">Phone: {orderData.shippingAddress.mobile}</span>
                    </div>
                  </div>

                  {/* Payment & Summary */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Payment Summary</h3>
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">{orderData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Payment Status</span>
                        <span className={`font-semibold ${orderData.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                          {orderData.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Total Items</span>
                        <span className="font-medium text-gray-900">{orderData.totalQuantity}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-1">
                        <span className="font-bold text-gray-900 text-base">Grand Total</span>
                        <span className="font-bold text-gray-900 text-lg">₹{orderData.totalPrice}</span>
                      </div>
                    </div>

                    {orderData.paymentStatus !== "Paid" && orderData.paymentMethod === "online" && (
                      <button
                        onClick={repayment}
                        className="w-full mt-2 py-3 bg-black text-white font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 active:scale-95 transition-all"
                      >
                        Retry Payment
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <UserConfirmModal
          text={modalText}
          heading={modalHeading}
          buttonConfigs={buttonConfigsModal}
          mainIcon={mainIcon}
        />
      )}
    </div>
  );
}

export default UserOrderDetails;
