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
    <div className="min-h-screen bg-gray-50 pt-32 md:pt-40 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3 sticky top-32 z-10">
             <UserProfileAside />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-9">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                    Order History
                </h2>

                {orders?.length ? (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-colors bg-white">
                                {/* Order Header */}
                                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-sm">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Order ID</span>
                                            <span className="font-bold text-gray-900">#{order.orderId || order._id.slice(-6)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Date</span>
                                            <span className="font-medium text-gray-900">{createDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                         <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Total Amount</span>
                                         <span className="font-bold text-gray-900">₹{order.totalPrice}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6 flex flex-col gap-6">
                                    {order.items.map((product, index) => (
                                        <div key={index} className="flex gap-4 sm:gap-6 items-start">
                                            <div className="w-20 h-24 sm:w-24 sm:h-32 shrink-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={product.productId.gallery[0]}
                                                    alt={product.productId.productName}
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{product.productId.productName}</h3>
                                                    <span className="text-sm text-gray-500">Qty: {product.quantity || 1}</span>
                                                    <span className="font-medium text-gray-900 sm:hidden">₹{product.price}</span>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="font-bold text-lg text-gray-900 hidden sm:block">₹{product.price}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                                        ${product.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                                                          product.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                          product.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                                                        }`}>
                                                        {product.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={() => navigate(`/profile/orderDetail/${order._id}`)}
                                            className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all text-sm shadow-sm"
                                        >
                                            View Order Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-center mt-6">
                             <div className="flex gap-2">
                                <button 
                                    disabled={page <= 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
                                >
                                    <i className="fas fa-chevron-left" />
                                </button>
                                <div className="h-10 px-4 flex items-center justify-center rounded-lg bg-gray-50 text-sm font-bold text-gray-900">
                                    Page {page} of {totalPages}
                                </div>
                                <button
                                    disabled={totalPages <= page}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
                                >
                                    <i className="fas fa-chevron-right" />
                                </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                           <i className="fas fa-box-open text-3xl text-gray-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't placed any orders yet. Start shopping to fill your wardrobe!</p>
                        <button
                            className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
                            onClick={() => navigate("/all")}
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOrders;
