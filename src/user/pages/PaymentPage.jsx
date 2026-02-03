import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useGetAddressesQuery } from "../../services/userProfile";
import {
  useApplyCouponMutation,
  useGetCartQuery,
  usePlaceOrderMutation,
  useVerifyOrderMutation,
  useUserGetCouponsQuery,
} from "../../services/userProductsApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CheckoutAddress from "../components/CheckoutAddress";

function PaymentPage() {
  const { data, refetch } = useGetAddressesQuery();
  const { data: cart, refetch: cartRefetch } = useGetCartQuery();
  const [verifyOrder] = useVerifyOrderMutation();
  const [applyCoupon] = useApplyCouponMutation();
  const { data: couponsData } = useUserGetCouponsQuery();

  const [placeOrder] = usePlaceOrderMutation();
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [totalPriceAfterDiscount, setTotalPriceAfterDiscount] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [editingAddress, setEdittingAddress] = useState(null);

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
      setTotalPriceAfterDiscount(cart.data.totalPriceAfterDiscount);
    }
    if (couponsData) {
      setCoupons(couponsData.data);
    }
  }, [data, cart, couponsData]);

  async function handleOrder() {
    try {
      if (!selectedAddress)
        return toast.error("Please select an address", {
          position: "top-right",
          theme: "dark",
        });
      if (!paymentMethod)
        return toast.error("Payment Method is Required", {
          position: "top-right",
          theme: "dark",
        });
      if (paymentMethod === "COD" && totalPriceAfterDiscount >= 1000) {
        return toast.error(
          "Cash On Delivery is only available for payment under 1000 RS",
          {
            position: "top-right",
            theme: "dark",
          }
        );
      }
      const updatedItems = products.map((product) => {
        const originalPrice = product.price;
        const offerValue = product.productId?.offer?.offerValue || 0;
        const priceAfterDiscount = calculatePrice(originalPrice, offerValue);

        return {
          ...product,
          price: priceAfterDiscount,
        };
      });
      const response = await placeOrder({
        address: selectedAddress,
        items: updatedItems,
        paymentMethod,
        couponDiscount,
        totalPrice: totalPriceAfterDiscount,
        totalQuantity: cart.data.totalQuantity,
        couponCode: coupon,
      }).unwrap();

      if (response) {
        if (paymentMethod === "online") {
          const { razorpayOrderId } = response.data;
          const options = {
            key: "rzp_test_fbT8KO8CYacXGs",
            amount: totalPriceAfterDiscount * 100,
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
                  cartRefetch();
                  navigate("/success");
                }
              } catch (error) {
                toast.error("Payment Verification Failed", {
                  position: "top-right",
                  theme: "dark",
                });
                navigate("/profile/orders");
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
            modal: {
              ondismiss: () => {
                toast.error("Payment Cancelled", {
                  position: "top-right",
                  theme: "dark",
                });
                navigate("/profile/orders");
              },
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          cartRefetch();
          navigate("/success");
        }
      }
    } catch (error) {
      console.log(error);
      navigate("/profile/orders");
      toast.error("Payment Failed", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  async function handleCouponSubmit() {
    try {
      if (!coupon)
        return toast.error("Enter a coupon", {
          position: "top-right",
          theme: "dark",
        });

      if (isCouponApplied)
        return toast.error("Coupon is already applied", {
          position: "top-right",
          theme: "dark",
        });

      const response = await applyCoupon({
        couponCode: coupon,
        cartTotal: totalPriceAfterDiscount,
      }).unwrap();
      if (response) {
        setIsCouponApplied(true);
        setCouponDiscount(response.data.discount);
        setTotalPriceAfterDiscount(response.data.totalPriceAfterDiscount);
        toast.success("Coupon Applied Successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid Coupon", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  function calculatePrice(originalPrice, offerValue) {
    return Math.floor(originalPrice - (originalPrice * offerValue) / 100);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] md:pt-[120px] pb-20">
      <Header />
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN - Address, Items, Payment Method */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Delivery Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <button
                  onClick={() => {
                    setEdittingAddress(null);
                    setIsModalOpen(true);
                  }}
                  className="text-sm font-bold text-black underline flex items-center gap-2"
                >
                  <i className="fas fa-plus" /> Add New
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {data && addresses.length > 0 ? (
                  addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddress?._id === address._id
                        ? "border-black bg-gray-50"
                        : "border-gray-100 hover:border-gray-200"
                        }`}
                    >
                      <input
                        type="radio"
                        onChange={() => setSelectedAddress(address)}
                        name="addressRadio"
                        checked={selectedAddress?._id === address._id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{address.name}</span>
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{address.mobile}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {[address.street, address.district, address.state, address.pincode].filter(Boolean).join(", ")}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEdittingAddress(address);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                      >
                        <i className="fas fa-pen text-sm" />
                      </button>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No addresses found. Please add one.
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="divide-y divide-gray-100">
                {products.map((product) => (
                  <div key={product._id} className="py-4 flex gap-4">
                    <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src={product.productId.gallery[0]?.url || product.productId.gallery}
                        alt={product.productId.productName}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.productId.productName}</h3>
                          {product.productId?.offer && (
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                              {product.productId.offer.offerValue}% OFF
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">
                            ₹{product.productId?.offer
                              ? calculatePrice(product.price, product.productId.offer.offerValue)
                              : product.price}
                          </div>
                          {product.productId?.offer && (
                            <div className="text-sm text-gray-400 line-through">₹{product.price}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Qty:</span>
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{product.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Online Payment</span>
                    <span className="text-xs text-gray-500">UPI, Cards, Net Banking</span>
                  </div>
                  <i className="fas fa-credit-card ml-auto text-gray-400 text-xl"></i>
                </label>

                <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === 'COD' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                    <span className="text-xs text-gray-500">Pay when you receive</span>
                  </div>
                  <i className="fas fa-money-bill-wave ml-auto text-gray-400 text-xl"></i>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-32">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart?.data?.products?.length || 0} items)</span>
                  <span className="font-medium text-gray-900">₹ {cart?.data.totalPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">- ₹ {cart?.data.totalPrice - totalPriceAfterDiscount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-bold text-gray-900 text-base">Total Amount</span>
                  <span className="font-bold text-gray-900 text-xl">₹ {totalPriceAfterDiscount}</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="relative flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full pl-4 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={handleCouponSubmit}
                    disabled={isCouponApplied || !coupon}
                    className="absolute right-1 top-1 bottom-1 px-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <button
                  onClick={() => setShowCoupons(!showCoupons)}
                  className="text-xs font-bold text-black underline hover:text-gray-600"
                >
                  View Available Coupons
                </button>

                {/* Coupons Dropdown */}
                {showCoupons && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-60 overflow-y-auto">
                    {coupons?.length > 0 ? (
                      coupons.map((cpn) => (
                        <div
                          key={cpn._id}
                          onClick={() => {
                            setCoupon(cpn.couponCode);
                            setShowCoupons(false);
                          }}
                          className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-50 last:border-0"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-900">{cpn.couponCode}</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{cpn.discountValue}% OFF</span>
                          </div>
                          <div className="text-xs text-gray-500">Min purchase: ₹{cpn.minPurchaseAmount}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">No coupons available</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleOrder}
                className="hidden lg:block w-full py-4 bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-black/10 hover:bg-gray-900 active:scale-95 transition-all"
              >
                Place Order
              </button>
            </div>

            {/* Mobile Sticky Place Order Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden safe-area-bottom">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{totalPriceAfterDiscount}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="flex-1 py-3 bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-black/10 active:scale-95 transition-all"
                >
                  Place Order
                </button>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex justify-center gap-6 text-2xl text-gray-300">
              <i className="fab fa-cc-visa hover:text-gray-400 transition-colors"></i>
              <i className="fab fa-cc-mastercard hover:text-gray-400 transition-colors"></i>
              <i className="fab fa-cc-amex hover:text-gray-400 transition-colors"></i>
              <i className="fas fa-shield-alt hover:text-gray-400 transition-colors"></i>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <CheckoutAddress
            closeModal={() => {
              setIsModalOpen(false);
              setEdittingAddress(null);
            }}
            editingAddress={editingAddress}
            refetch={refetch}
          />
        )}
      </div>
      <ToastContainer />
    </div >
  );
}

export default PaymentPage;
