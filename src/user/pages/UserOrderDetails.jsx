import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import {
  useUpdateOrderStatusMutation,
  useGetOneOrderQuery,
  useLazyDownloadInvoiceQuery,
} from "../../services/userProfile";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserConfirmModal from "../components/UserConfirmModal";
import { useVerifyOrderMutation } from "../../services/userProductsApi";

function UserOrderDetails() {
  const { orderId } = useParams();
  const { data, refetch } = useGetOneOrderQuery(orderId);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyOrder] = useVerifyOrderMutation();
  const [downloadInvoice] = useLazyDownloadInvoiceQuery();

  // states
  const [orderData, setOrderData] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [buttonConfigsModal, setButtonCofigsModal] = useState([]);

  const mainIcon = <i className="fas fa-question text-3xl"></i>;

  useEffect(() => {
    if (data) setOrderData(data.data);
  }, [data]);

  // function to create date
  function createDate(timeStamp) {
    const date = new Date(timeStamp);

    const formated = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formated;
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
        toast.success("Order Cancelled", {
          position: "top-right",
          theme: "dark",
        });
        refetch();
      }
    } catch (error) {
      toast.error(error.data.message, {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  // function to set style
  function getStyle(status) {
    switch (status) {
      case "Pending":
        return "text-red-500";
      case "Shipped":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-orange-500";
    }
  }

  // function to handle modal
  const handleModalOpen = (orderId, itemId, status) => {
    setModalHeading(
      `${status === "Cancelled" ? "Cancel" : "Return"} Order Status`
    );
    setModalText(
      `Are you sure to ${
        status === "Cancelled" ? "Cancel" : "Return"
      } the order`
    );
    setButtonCofigsModal([
      {
        name: "Cancel",
        action: () => setModal(false),
        styles: "px-4 py-2  bg-gray-200 text-sm mr-4 rounded-lg",
      },
      {
        name: "Continue",
        action: () => {
          handleUpdateStatus(orderId, itemId, status);
          setModal(false);
        },
        styles: "px-4 py-2 text-sm mr-4 rounded-lg border",
      },
    ]);
    setModal(true);
  };

  async function repayment() {
    const { razorpayOrderId, totalPrice } = orderData;
    const options = {
      key: "rzp_test_fbT8KO8CYacXGs",
      amount: totalPrice * 100,
      currency: "INR",
      name: "DORESU",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async (paymentResponse) => {
        // to verify payment
        try {
          console.log("payment response ", paymentResponse);
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
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();
  }

  async function handleDdownloadInvoice() {
    try {
      const response = await downloadInvoice(orderId).unwrap();
      const blob = new Blob([response], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf `;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
        <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center gap-11 border px-10 py-5 flex-1">
          <h2 className="text-[20px] font-bold ">Order Dtails</h2>
          {orderData ? (
            <div className="w-full border-b">
              {orderData?.items.map((item) => (
                <div
                  key={item._id}
                  className="w-full flex flex-col gap-4 px-5 py-7"
                >
                  <div className="w-full px-5 py-2 bg-[#f0f0f0] flex justify-between">
                    <div className="flex gap-2">
                      <span>Order Status: </span>
                      <span
                        className={`${getStyle(
                          item.status
                        )} flex items-center justify-end gap-1`}
                      >
                        <i className="fas fa-circle text-[5px]" /> {item.status}
                      </span>
                    </div>
                    <div>
                      <span>Order Id: {orderData?._id} </span>
                    </div>
                  </div>
                  <div className="flex justify-between gap-5 px-3">
                    <div className="h-[100px] border">
                      <img
                        className="w-full h-full object-contain"
                        src={item.gallery[0]}
                        alt="product image"
                      />
                    </div>
                    <div className="flex flex-col max-w-[350px]">
                      <span className="text-[17px] font-medium">
                        {item.productId.productName}
                      </span>
                      <span className="text-[15px]">Size: {item.size}</span>
                    </div>
                    <div>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="font-semibold text-[20px]">
                        ₹{item.price}
                      </span>
                      <div>
                        {item.status === "Delivered" ? (
                          <button
                            onClick={() =>
                              handleModalOpen(
                                orderData._id,
                                item._id,
                                "Returned"
                              )
                            }
                            className="px-5 py-2 rounded-lg bg-orange-300"
                          >
                            Return Order
                          </button>
                        ) : (
                          item.status !== "Cancelled" &&
                          item.status !== "Returned" && (
                            <button
                              onClick={() =>
                                handleModalOpen(
                                  orderData._id,
                                  item._id,
                                  "Cancelled"
                                )
                              }
                              className="px-5 py-2 rounded-lg bg-orange-300"
                            >
                              Cancel Order
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span>Could'nt find order</span>
          )}

          {orderData && (
            <>
              <div className="w-full flex px-5 justify-between">
                <div className="flex flex-col gap-3">
                  <span className="text-[#737373]">
                    Order Date: {createDate(orderData?.createdAt)}
                  </span>
                  <span>Payment Method: {orderData?.paymentMethod}</span>
                  <span
                    className={`text-${
                      orderData?.paymentStatus === "Paid" ? "green" : "red"
                    }-500`}
                  >
                    Payment Status: {orderData?.paymentStatus}
                  </span>
                  {/* for future order tracking */}
                  {/* <span className="flex flex-col px-4 gap-2 text-green-400">
                  <i className="far fa-circle text-[8px]" />
                  <i className="far fa-circle text-[8px]" />
                  <i className="far fa-circle text-[8px]" />
                  <span>
                    <i className="far fa-circle-check text-[16px] -translate-x-1" />
                    <span className="text-black">
                      <span>Delivered On Aug 13</span>
                      <span className="block text-[15px] pl-4">
                        Your Item has Delivered
                      </span>
                    </span>
                  </span>
                </span> */}
                </div>
                <div className="min-h-full flex flex-col justify-between ">
                  <span>item(s) Subtotal: {orderData?.totalQuantity} </span>
                  <span className="font-semibold">
                    Total For this Order: ₹{orderData?.totalPrice}{" "}
                  </span>
                  {orderData?.paymentStatus !== "Paid" &&
                    orderData?.paymentMethod === "online" && (
                      <button
                        onClick={repayment}
                        className="px-4 py-2 bg-black text-white"
                      >
                        Retry Payment
                      </button>
                    )}
                </div>
              </div>
              <div className="w-full flex flex-col items-center gap-5">
                <h2 className="font-semibold text-[20px]">Shipping Details</h2>
                <div className="flex gap-10">
                  <div className="flex flex-col font-semibold text-[#484848]">
                    <span>{orderData?.shippingAddress.name}</span>
                    <span>{orderData?.shippingAddress.mobile}</span>
                  </div>
                  <div className="flex flex-col font-medium text-[#8A8A8A]">
                    <span>{orderData?.shippingAddress.street}</span>
                    <span>
                      {orderData?.shippingAddress.district} -{" "}
                      {orderData?.shippingAddress.pincode}
                    </span>
                    <span>{orderData?.shippingAddress.state}</span>
                    <span>India</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <button
                  onClick={handleDdownloadInvoice}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Download Invoice
                </button>
              </div>
            </>
          )}
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
