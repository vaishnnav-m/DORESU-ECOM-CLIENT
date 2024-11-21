import React, { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import { useLazyGetOrderHistoriesQuery } from "../../services/adminFethApi";

function AdminSalesReportPage() {
  const [getOrderHistories] = useLazyGetOrderHistoriesQuery();
  const [histories, setHistories] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter,setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  async function fetchOrders() {
    try {
      const response = await getOrderHistories({ filter, startDate, endDate }).unwrap();
      if (response) {
        console.log(response);
        setHistories(response.data);
  
        // Calculate totals here
        const totalRevenue = response.data.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalProducts = response.data.reduce((acc, order) => acc + order.items.length, 0);
        setTotalRevenue(totalRevenue);
        setTotalProducts(totalProducts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [filter]);

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

  console.log(filter);
  return (
    <div className="bg-[#E7E7E3] flex min-h-screen relative">
      <Aside />
      <main className="w-full pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Sales Report</h2>
            <span className="text-[16px]">
              Admin <i className="fa-solid fa-angle-right text-sm"></i> Sales
            </span>
          </div>
        </div>
        <div className="w-full p-10 flex flex-col gap-10">
          <div className="w-full px-5 flex gap-16">
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-5 items-center">
              <h2 className="text-[20px] font-bold">Total Orders</h2>
              <span className="text-[40px] font-extrabold">
                {histories && histories.length}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-5 items-center">
              <h2 className="text-[20px] font-bold">Total Revenue</h2>
              <span className="text-[40px] tracking-widest font-extrabold">
                ₹{totalRevenue}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-5 items-center">
              <h2 className="text-[20px] font-bold">Total Products</h2>
              <span className="text-[40px] font-extrabold">
                {totalProducts}
              </span>
            </div>
          </div>
          <div>
            <div className="w-full flex px-5 mb-3"></div>
            <table className="min-w-full text-left table-fixed divide-y divide-gray-200 bg-white rounded-2xl">
              <thead>
                <tr>
                  <td colSpan="5" className="p-2 flex items-center gap-5">
                    <div className="w-fit rounded-lg bg-white border p-3">
                      <select onChange={(e) => setFilter(e.target.value)} className="bg-transparent focus:outline-none"  >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                      <button  className="h-fit px-3 py-2 rounded-lg bg-black text-white">Apply Filter</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    OrderId
                  </td>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    Costomer Name
                  </td>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    Date
                  </td>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    Items
                  </td>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    Price
                  </td>
                  <td className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase">
                    Payment Method
                  </td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200  text-[14px] font-semibold">
                {histories &&
                  histories.map((history) => (
                    <tr key={history._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.shippingAddress.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {createDate(history.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.items.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹ {history.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap uppercase">
                        {history.paymentMethod}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminSalesReportPage;
