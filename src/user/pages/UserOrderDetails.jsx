import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import { useCancelOrderMutation, useGetOneOrderQuery } from "../../services/userProfile";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UserOrderDetails() {
  const { orderId } = useParams();
  const { data,refetch } = useGetOneOrderQuery(orderId);
  const [cancelOrder] = useCancelOrderMutation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (data) setOrderData(data.data);
  }, [data]);

  console.log(data?.data);

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

  async function handleCancel(orderId,itemId,status="Cancel"){
    try {
      const response = await cancelOrder({orderId,itemId,status}).unwrap();
      if(response){
        toast.success("Order Cancelled", {
          position: "top-right",
          theme: "dark",
        });
        refetch();
      }
      
    } catch (error) {
      toast.error(error.data.message,{
        position: "top-right",
        theme: "dark",
      })
    }
  }

  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="w-[70%] flex gap-10">
        <UserProfileAside />
        <div className="flex flex-col items-center gap-11 border px-10 py-5 flex-1">
          <h2 className="text-[20px] font-bold ">Order Dtails</h2>
          <div className="w-full border-b">
            {orderData?.items.map((item) => (
              <div
                key={item._id}
                className="w-full flex flex-col gap-4 px-5 py-7"
              >
                <div className="w-full px-5 py-2 bg-[#f0f0f0] flex justify-between">
                  <div>
                    <span>Order Status: {item.status} </span>
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
                        <button className="px-5 py-2 rounded-lg bg-orange-300">
                          Return Order
                        </button>
                      ) :item.status !=="Cancel" && (
                        <button onClick={() => handleCancel(orderData._id,item._id)} className="px-5 py-2 rounded-lg bg-orange-300">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex px-5 justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-[#737373]">
                Order Date: {createDate(orderData?.createdAt)}
              </span>
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
        </div>
      </main>
    </div>
  );
}

export default UserOrderDetails;
