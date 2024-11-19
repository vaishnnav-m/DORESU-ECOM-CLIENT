import { useUpdateOrderStatusMutation } from "../../services/adminFethApi";
import { toast } from "react-toastify";

function AdminOrderDetail({ order, date, address, handleModal }) {
  const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // to set style
  function getStyle(status) {
    switch (status) {
      case "Pending":
        return "bg-red-300 text-red-800";
      case "Shipped":
        return "bg-blue-300 text-blue-800";
      case "Delivered":
        return "bg-green-300 text-green-800";
      case "Cancelled":
        return "bg-orange-300 text-orange-800";
    }
  }

  // function to handle status change
  async function handleStatus(status, itemId, orderId) {
    try {
      const response = await updateOrderStatus({
        status,
        itemId,
        orderId,
      }).unwrap();
      if (response) {
        toast.success(response.message, {
          position: "top-right",
          theme: "dark",
        });
        handleModal();
      }
    } catch (error) {
      console.log(error);
      toast.error("Product update failed.", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  return (
    <div className="absolute inset-0 z-[999] bg-[#00000057] flex justify-center items-center ">
      <div className="w-[70%] h-[60%] bg-white p-10 flex flex-col gap-8 relative">
        <button
          onClick={() => handleModal()}
          className="absolute cursor-pointer right-5 top-5 bg-black text-white rounded-full"
        >
          <i className="fas fa-x px-3 py-3" />
        </button>
        <h1 className="text-[20px] font-bold">Order Details</h1>
        <div className="flex gap-5">
          <div>
            <h2 className="font-semibold">Order Id: </h2>
            <h2 className="font-semibold">Customer Name: </h2>
            <h2 className="font-semibold">Delivery Address:</h2>
            <h2 className="font-semibold">Date: </h2>
          </div>
          <div className="flex flex-col">
            <span className="font-normal">{order._id}</span>
            <span className="font-normal">{order.shippingAddress.name}</span>
            <span className="font-normal">{address}</span>
            <span className="font-normal">{date}</span>
          </div>
        </div>
        <table className="border-collapse table-fixed w-full">
          <thead>
            <tr>
              <td className="px-6 py-3 font-bold">Product Image</td>
              <td className="px-6 py-3 font-bold">Product Name</td>
              <td className="px-6 py-3 font-bold">Product Varient</td>
              <td className="px-6 py-3 font-bold">Price</td>
              <td className="px-6 py-3 font-bold">Status</td>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-3">
                  <img
                    className="h-[100px]"
                    src={item.productId.gallery[0]}
                    alt=""
                  />
                </td>
                <td className="px-6 py-3">
                  <div className="flex">
                    <span className="max-w-[150px] truncate">{item.productId.productName}</span>
                  </div>
                </td>
                <td className="px-6 py-3">{item.size}</td>
                <td className="px-6 py-3">₹ {item.price}</td>
                <td className="px-6 py-3 cursor-pointer relative group">
                  <span
                    className={`${getStyle(item.status)} rounded-lg px-3 py-2`}
                  >
                    {item.status} <i className="fas fa-angle-down" />
                  </span>
                  <div className="absolute z-[999] bg-white left-4 py-5 px-3 shadow-xl hidden flex-col gap-2 group-hover:flex">
                    {statuses.map(
                      (status, index) =>
                        status !== item.status && (
                          <span
                            key={index}
                            onClick={() =>
                              handleStatus(status, item._id, order._id)
                            }
                            className={` ${getStyle(
                              status
                            )} rounded-lg px-3 py-2`}
                          >
                            {status}
                          </span>
                        )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
