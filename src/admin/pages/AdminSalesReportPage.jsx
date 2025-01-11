import React, { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import { useLazyDownloadExcelReportQuery, useLazyDownloadPDFReportQuery, useLazyGetOrderHistoriesQuery } from "../../services/adminFethApi";

function AdminSalesReportPage() {
  const [getOrderHistories] = useLazyGetOrderHistoriesQuery();
  const [pdfDownload] = useLazyDownloadPDFReportQuery()
  const [excelDownload] = useLazyDownloadExcelReportQuery();

  // states
  const [histories, setHistories] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);

  const limit = 10;

  async function fetchOrders() {
    console.log(startDate,endDate);
    try {
      const response = await getOrderHistories({
        filter,
        startDate,
        endDate,
        page,
        limit
      }).unwrap();
      if (response) {
        setHistories(response.data.orders);

        // Calculate totals here
        const totalRevenue = response.data.orders.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        const totalProducts = response.data.orders.reduce(
          (acc, order) => acc + order.items.length,
          0
        );
        setTotalPages(response.data.totalPages)
        setTotalRevenue(totalRevenue);
        setTotalProducts(totalProducts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [filter, startDate, endDate,page]);

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

    async function handlePdfDownload (){
      try {
        const response = await pdfDownload({
          filter,
          startDate,
          endDate,
        }).unwrap();

        const blob = new Blob([response],{
          type:"application/pdf"
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `DORESU-Sales-Report.pdf`
        link.click();
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.log(error);
      }
    }

  async function handleXLDownload (){
    try {
      const response = await excelDownload({
        startDate,
        endDate,
        filter,
      }).unwrap();

      const blob = new Blob([response],{
        type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `DORESU-Sales-Report.xlsx`
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
    }
  }
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
            <table className="min-w-full text-left table-fixed divide-y divide-gray-200 bg-white rounded-2xl">
              <thead>
                <tr>
                  <td colSpan="6" className="p-2">
                    <div className="w-full flex justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-fit rounded-lg bg-white border p-3">
                          <select
                            onChange={(e) => setFilter(e.target.value)}
                            value={filter}
                            className="bg-transparent focus:outline-none"
                          >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        {filter === "custom" && (
                          <>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="p-2 ml-3 border rounded"
                            />
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="p-2 ml-3 border rounded"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex gap-5">
                        <button onClick={handlePdfDownload} className="px-3 py-2 rounded-lg  bg-[#d4d4d4] border">Download (PDF)</button>
                        <button onClick={handleXLDownload} className="px-3 py-2 rounded-lg bg-[#d4d4d4] border">Download (Excel)</button>
                      </div>
                    </div>
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
            <div className="flex justify-center pt-2">
            <div className="bg-white">
              <button className={`px-5 py-2 border-[2px] ${page == 1 && "hidden"}`} onClick={() => setPage((prev) => prev-1)}><i className="fas fa-arrow-left"/></button>
              <button disabled className="px-5 py-2 border-[2px]">{page} / {totalPages}</button>
              <button className={`px-5 py-2 border-[2px] ${totalPages === page && "hidden"}`} onClick={() => setPage((prev) => prev+1)} ><i className="fas fa-arrow-right"/></button>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminSalesReportPage;
