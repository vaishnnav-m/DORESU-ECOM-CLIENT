import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useGetAddressesQuery } from "../../services/userProfile";
import {
  useGetCartQuery,
  usePlaceOrderMutation,
  useVerifyOrderMutation,
} from "../../services/userProductsApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CheckoutAddress from "../components/CheckoutAddress";

function PaymentPage() {
  const { data } = useGetAddressesQuery();
  const { data: cart } = useGetCartQuery();
  const [verifyOrder] = useVerifyOrderMutation();

  const [placeOrder] = usePlaceOrderMutation();
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setAddresses(data.data);
      const defaultAddress = data.data.find((address) => address.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
    if (cart) {
      setProducts(cart.data.products);
    }
  }, [data, cart]);

  async function handleOrder() {
    try {
      if (!paymentMethod)
        return toast.error("Payment Method is Required", {
          position: "top-right",
          theme: "dark",
        });

      const response = await placeOrder({
        address: selectedAddress,
        items: products,
        paymentMethod,
        totalPrice: cart.data.totalPrice,
        totalQuantity: cart.data.totalQuantity,
      }).unwrap();
      if (response) {
        if (paymentMethod === "online") {
          const { razorpayOrderId } = response.data;
          const options = {
            key: "rzp_test_fbT8KO8CYacXGs",
            amount: cart.data.totalPrice * 100,
            currency: "INR",
            name: "Your Store Name",
            description: "Order Payment",
            order_id: razorpayOrderId,
            handler: async (paymentResponse) => {
              // to verify payment
              try {
                console.log("payment response ",paymentResponse);
                const response = await verifyOrder({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }).unwrap();

                if (response) {
                  navigate("/success");
                }
              } catch (error) {
                console.log("Payment Verification Failed", error);
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
        } else {
          navigate("/success");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[200px]">
      <Header />
      <main className="w-[70%] flex flex-col items-center gap-10 shadow-xl px-10">
        <div className="w-full flex gap-10 pb-10">
          <div className="flex-1 flex flex-col gap-5">
            <div className="border border-[#8A8A8A] rounded-xl px-8 py-2">
              <table className="w-full">
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="text-center border-b border-gray-300"
                    >
                      <td className="px-2 py-4">
                        <div className="flex gap-10">
                          <div className="w-[85px] h-[78px] flex-shrink-0">
                            <img
                              className="w-full h-full"
                              src={product.productId.gallery}
                              alt="product Image"
                            />
                          </div>
                          <div className=" flex flex-col justify-between text-start">
                            <span className="truncate max-w-[230px]">
                              {product.productId.productName}
                            </span>
                            <span className="pl-[8px] font-semibold text-[20px] cursor-pointer">
                              ₹ {product.price}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="h-full flex items-center">
                          <span className="px-4 py-2 bg-[#D9D9D9] rounded-full">
                            {product.quantity}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-[#8A8A8A] rounded-xl flex flex-col items-start gap-5 px-5 py-2">
              <h2 className="text-[20px] font-semibold">Delivery Address</h2>
              {data &&
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className="bg-[#F5F5F5] rounded-lg px-5 py-2 flex gap-5 font-semibold"
                  >
                    <input
                      type="radio"
                      onChange={() => setSelectedAddress(address)}
                      name="addressRadio"
                      checked={selectedAddress?._id === address._id}
                    />
                    <span className="text-[#8A8A8A] ">
                      {address.name +
                        "," +
                        address.street +
                        "," +
                        address.district +
                        "," +
                        address.state +
                        "," +
                        address.pincode}
                      <i className="fas fa-pen pl-3 text-[15px] cursor-pointer" />
                      {/* <span className="underline text-black cursor-pointer pl-2">Edit Address</span> */}
                    </span>
                  </div>
                ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold"
              >
                <i className="fas fa-plus" />
                Add a new adress
              </button>
            </div>

            <div className="border border-[#8A8A8A] rounded-xl flex flex-col items-start gap-5 px-8 py-2 font-semibold">
              <div>
                <h2 className="text-[20px]">Payment Method</h2>
                <span className="text-[#8A8A8A]">
                  Select any payment method
                </span>
              </div>
              <div>
                <div className="px-5 py-2 flex gap-5 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    onChange={() => setPaymentMethod("wallet")}
                  />
                  Wallet
                </div>
                <div className="px-5 py-2 flex gap-5 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    onChange={() => setPaymentMethod("online")}
                  />
                  Online Payment
                </div>
                <div className="px-5 py-2 flex gap-5 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    onChange={() => setPaymentMethod("COD")}
                  />
                  Cash On Delivery
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-10">
            <div className="border border-[#8A8A8A] rounded-xl flex flex-col items-start gap-5 px-8 py-2">
              <h2 className="text-[20px] font-semibold">Order Summary</h2>
              <div className="w-full flex flex-col gap-3">
                <div className="w-full flex justify-between">
                  <span className="text-[#8A8A8A]">Subtotal</span>
                  <span className="font-semibold">
                    ₹ {cart?.data.totalPrice}
                  </span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-[#8A8A8A]">Discount (-0%)</span>
                  <span className="font-semibold text-red-500">- ₹ 0</span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-[#8A8A8A]">Delivery Fee</span>
                  <span className="font-semibold">₹ 0 </span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-[#8A8A8A]">Items</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-[#8A8A8A]">GST</span>
                  <span className="font-semibold">₹0</span>
                </div>
              </div>
              <div className="w-full border-t flex justify-between pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-[20px]">
                  ₹ {cart?.data.totalPrice}
                </span>
              </div>
              <div className="w-full flex gap-5 relative">
                <div className="flex-1 flex 3 rounded-full bg-[#F5F5F5]">
                  <input
                    name="promo"
                    className="w-full px-5 h-full bg-transparent focus:outline-none peer"
                    type="text"
                  />
                  <label
                    htmlFor="promo"
                    className="absolute left-5 top-1/2 -translate-y-1/2 flex gap-3 items-center text-[12px] text-[#8A8A8A] peer-focus:hidden"
                  >
                    <i className="fas fa-tag text-[16px]" />
                    Do you have a promo code ?
                  </label>
                </div>
                <button className="py-2 px-5 bg-black text-white rounded-full">
                  Apply
                </button>
              </div>
            </div>
            <div className="border border-[#8A8A8A] rounded-xl flex flex-col items-start gap-5 px-8 py-2  font-semibold">
              <div className="flex flex-col gap-2">
                <span className="text-[#8A8A8A] underline">Contact Us</span>
                <span className="text-[#8A8A8A] underline">Delivery</span>
                <span className="text-[#8A8A8A] underline">
                  Return & Refund
                </span>
                <span className="text-[#8A8A8A] underline">
                  Promotion & Vouchers
                </span>
              </div>
              <div>
                <span className="text-[#8A8A8A]">Accepted Payment Methods</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="py-3 text-[20px] w-full bg-black text-white rounded-full"
            >
              Place Order
            </button>
          </div>
        </div>
        {isModalOpen && (
          <CheckoutAddress
            closeModal={() => setIsModalOpen(false)}
            address={selectedAddress}
            setAddress={(address) => setSelectedAddress(address)}
          />
        )}
      </main>
      <ToastContainer />
    </div>
  );
}

export default PaymentPage;
