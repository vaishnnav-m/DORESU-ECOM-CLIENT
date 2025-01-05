import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import { useLazyGetUserOrderHistoriesQuery } from "../../services/userProfile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserOrders() {
  const [getOrderHistories] = useLazyGetUserOrderHistoriesQuery();
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 5;

  const navigate = useNavigate();

  async function fetchOrders() {
    try {
      const response = await getOrderHistories({ page, limit }).unwrap();
      if (response) {
        setTotalPages(response.data.totalPages);
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect to set Orders
  useEffect(() => {
    fetchOrders();
  }, [page]);

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
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
        <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center gap-11 border xl:px-10 px-5 py-5 flex-1">
          <h2 className="text-[20px] font-bold ">Orders</h2>
          {orders?.length ? (
            <>
              {orders.map((order) => (
                <div className="w-full" key={order._id}>
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
                    {order.items.map((product, index) => (
                      <div key={index} className="w-full flex gap-5">
                        <div className="h-[100px] min-w-[100px] border">
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
                          <span className="font-semibold text-[20px]">
                            ₹{product.price}
                          </span>
                        </div>
                        <div className="w-full text-end px-5">
                          <span
                            className={`${getStyle(
                              product.status
                            )} flex items-center justify-end gap-2`}
                          >
                            <i className="fas fa-circle text-[5px]" />{" "}
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="w-full text-end border-t pt-5">
                      <button
                        onClick={() =>
                          navigate(`/profile/orderDetail/${order._id}`)
                        }
                        className="px-5 py-3 rounded-lg bg-[#eaeaea]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <div className="bg-white">
                  <button
                    className={`px-5 py-2 border-[2px] ${
                      page <= 1 && "hidden"
                    }`}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    <i className="fas fa-arrow-left" />
                  </button>
                  <button disabled className="px-5 py-2 border-[2px]">
                    {page} / {totalPages}
                  </button>
                  <button
                    className={`px-5 py-2 border-[2px] ${
                      totalPages <= page && "hidden"
                    }`}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    <i className="fas fa-arrow-right" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center py-10">
              <h2 className="text-[20px] font-medium ">No Orders !</h2>
              <button
                className="bg-[black] text-white px-5 py-2 rounded-lg mt-5"
                onClick={() => navigate("/all")}
              >
                Find Products
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserOrders;
