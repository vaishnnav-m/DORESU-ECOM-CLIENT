import React, { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import { useLazyGetOrderHistoriesQuery } from "../../services/adminFethApi";
import AdminOrderDetail from "../components/AdminOrderDetail";

function AdminOrderList() {
  const [getOrderHistories] = useLazyGetOrderHistoriesQuery();
  const [histories, setHistories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter,setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);

  const limit = 9;


  async function fetchOrders() {
    try {
      const response = await getOrderHistories({ filter, startDate, endDate, page, limit }).unwrap();
      if (response) {
        setTotalPages(response.data.totalPages)
        setHistories(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [filter,page]);

  function createAddress(address) {
    return (
      address.houseName +
      "," +
      address.street +
      "," +
      address.district +
      "," +
      address.state
    );
  }
  // function to set style
  function getStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-orange-300 text-orange-800";
      case "Shipped":
        return "bg-blue-300 text-blue-800";
      case "Delivered":
        return "bg-green-300 text-green-800";
      case "Cancelled":
        return "bg-red-300 text-red-800";
      case "Returned":
        return "bg-gray-300 text-gray-800";
    }
  }

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

  // function to handle action
  function handleAction(order) {
    setSelected(order);
    setIsModalOpen(true);
  }

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
          <table className="min-w-full text-left divide-y divide-gray-200 bg-white rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  OrderId
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Delivery Address
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </td>
                <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </td>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200  text-[14px] font-semibold">
              {histories &&
                histories.map((history) => (
                  <tr key={history._id} className="px-6 py-4 ">
                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      {history.orderId||history._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      {history.shippingAddress.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      {createAddress(history.shippingAddress)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      {createDate(history.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      ₹ {history.totalPrice}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate">
                      <span
                        className={`${getStyle(
                          history.items[0].status
                        )} rounded-lg px-3 py-2`}
                      >
                        {history.items[0].status}
                      </span>
                      <span>({history.items.length - 1}) more</span>
                    </td>

                    
                    <td className="px-12 py-4 whitespace-nowrap  max-w-[100px] truncate text-[20px]">
                      <button onClick={() => handleAction(history)}>
                        <i className="fas fa-ellipsis" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-center pt-2">
            <div className="bg-white">
              <button className={`px-5 py-2 border-[2px] ${page == 1 && "hidden"}`} onClick={() => setPage((prev) => prev-1)}><i className="fas fa-arrow-left"/></button>
              <button disabled className="px-5 py-2 border-[2px]">{page} / {totalPages}</button>
              <button className={`px-5 py-2 border-[2px] ${totalPages === page && "hidden"}`} onClick={() => setPage((prev) => prev+1)} ><i className="fas fa-arrow-right"/></button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="absolute inset-0 z-[999] bg-[#00000057] flex justify-center items-center ">
            <AdminOrderDetail
              order={selected}
              address={createAddress(selected.shippingAddress)}
              date={createDate(selected.createdAt)}
              handleModal={() => setIsModalOpen(false)}
              fetchOrders={() => fetchOrders()}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminOrderList;
