import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import { useGetUserOrderHistoriesQuery } from "../../services/userProfile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserOrders() {
  const { data } = useGetUserOrderHistoriesQuery();
  const [orders, setOrders] = useState(null);

  const navigate = useNavigate();

  // useEffect to set Orders
  useEffect(() => {
    if (data) setOrders(data.data);
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
  return (
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="w-[70%] flex gap-10">
        <UserProfileAside />
        <div className="flex flex-col items-center gap-11 border px-10 py-5 flex-1">
          <h2 className="text-[20px] font-bold ">Orders</h2>
          {orders &&
            orders.map((order) => (
              <div key={order._id}>
                <div className="w-full px-5 py-2 bg-[#f0f0f0] flex justify-between">
                  <div>
                    <h2 className="font-semibold">OrderId: {order._id}</h2>
                    <span>Date: {createDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      Total Price: ₹{order.totalPrice}
                    </h2>
                    <span>Total Quantity: {order.totalQuantity}</span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-4 px-5 py-7 border-b">
                  {order.items.map((product,index) => (
                    <div key={index} className="w-full flex gap-5">
                      <div className="h-[100px] w-[400px] border">
                        <img
                          className="w-full h-full object-contain"
                          src={product.productId.gallery[0]}
                          alt="product image"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="text-[18px] font-semibold max-w-[180px] truncate">
                          {product.productId.productName}
                        </span>
                        <span className="text-[15px]">Colour: White</span>
                      </div>
                      <div className="w-full">
                        <span className="font-semibold text-[20px]">₹287</span>
                      </div>
                      <div className="w-full text-end px-5">
                        <span className={`${getStyle(product.status)} flex items-center justify-end gap-2`}>
                         <i className="fas fa-circle text-[5px]"/> {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="w-full text-end border-t pt-5">
                    <button onClick={() => navigate(`/profile/orderDetail/${order._id}`)} className="px-5 py-3 rounded-lg bg-[#eaeaea]">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default UserOrders;
