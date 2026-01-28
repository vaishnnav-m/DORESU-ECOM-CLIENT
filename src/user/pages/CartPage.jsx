import { useEffect, useState } from "react";
import {
  useGetCartQuery,
  useRemoveCartProductMutation,
  useUpdateCartMutation,
} from "../../services/userProductsApi";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { data: cart, isSuccess, isLoading, refetch } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeCartProduct] = useRemoveCartProductMutation();

  const [cartData, setCartData] = useState({});
  const [products, setProducts] = useState([]);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && cart?.data) {
      setCartData(cart.data);
      setProducts(cart.data.products || []);
    }
  }, [cart, isSuccess]);

  async function updateCartQuantity(productId, newQuantity) {
    const previousProducts = [...products];
    try {
      const response = await updateCart({ productId, newQuantity }).unwrap();
      if (response) {
        refetch();
      }
    } catch (error) {
      setProducts(previousProducts)
      toast.error(error.data.message, {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  async function handleQuantity(productId, newQuantity) {
    if (newQuantity > 5) {
      return toast.error("Max limit reached (5 items)", {
        position: "top-right",
        theme: "dark",
      });
    }
    if (newQuantity < 1) {
      return toast.error("At least one item is required", {
        position: "top-right",
        theme: "dark",
      });
    }
    setProducts((prev) =>
      prev.map((product) =>
        product.productId._id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
    await updateCartQuantity(productId, newQuantity);
  }

  async function handleRemove(productId) {
    try {
      const response = await removeCartProduct({ productId }).unwrap();
      if (response) {
        toast.success("Item removed successfully", {
          position: "top-right",
          theme: "dark",
        });
        refetch();
      }
    } catch (error) {
      toast.error(error.data.message, {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  function calculatePrice(originalPrice, offerValue) {
    return Math.floor(originalPrice - (originalPrice * offerValue) / 100);
  }

  async function handleCheckout() {
    try {
      await refetch();
      if(!cart?.data?.products?.length){
        return toast.error("No products in the cart", {
          position: "top-right",
          theme: "dark",
        });
      }
      const invalidProducts = cart.data.products.filter(
        (product) => product.quantityLeft === 0
      );
      if (invalidProducts?.length > 0) {
        return toast.error("One or more items are out of stock", {
          position: "top-right",
          theme: "dark",
        });
      }
      navigate("/payment")
    } catch (error) {
      toast.error("Checkout failed. Please try again.", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen w-full bg-gray-50 pt-40 pb-12 flex justify-center">
            <div className="w-full max-w-7xl px-4">
               <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
               <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 flex flex-col gap-4">
                     {[1,2,3].map(i => (
                        <div key={i} className="h-32 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
                     ))}
                  </div>
                  <div className="lg:w-[380px] h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
               </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] pt-24 md:pt-40 pb-32 md:pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="flex flex-row items-end justify-between sm:justify-start gap-3 mb-6 sm:mb-10 border-b border-gray-200 pb-4">
             <div className="flex items-end gap-3">
                 <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
                 <span className="text-gray-500 font-medium mb-1 text-sm sm:text-lg">
                    ({products.length} {products.length === 1 ? 'Item' : 'Items'})
                 </span>
             </div>
        </div>

        {(!products || products.length === 0) ? (
          /* Empty State */
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                   <i className="fas fa-shopping-basket text-3xl text-gray-300"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">
                   Looks like you haven't made your choice yet. Explore our collection and find your perfect outfit.
                </p>
                <button
                  className="bg-black text-white px-10 py-3.5 rounded-full font-bold hover:bg-[#333] transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest"
                  onClick={() => navigate("/all")}
                >
                  Start Shopping
                </button>
          </div>
        ) : (
          /* Cart Content */
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
             {/* ... (Cart Items & Summary code remains the same as before, just ensuring wrapper is correct) ... */}
                {/* Cart Items List */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100/50 flex flex-row gap-4 sm:gap-6 items-start hover:border-gray-200 transition-all"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-28 sm:w-32 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img
                          className="w-full h-full object-cover"
                          src={product.productId.gallery}
                          alt={product.productId.productName}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 w-full flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[112px] sm:min-h-0">
                        
                        {/* Title & Specs */}
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          <div className="flex justify-between items-start">
                              <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 max-w-[200px] sm:max-w-[250px] leading-snug">
                                {product.productId.productName}
                              </h3>
                              {/* Remove Button Mobile (Top Right) */}
                              <button
                                  onClick={() => handleRemove(product.productId._id)}
                                  className="sm:hidden text-gray-300 hover:text-red-500 transition-colors p-1"
                                  title="Remove"
                                >
                                  <i className="fas fa-times text-base"></i>
                               </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                Size: {product.size}
                              </span>
                              {product.productId?.offer && (
                                <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                    {product?.productId?.offer.offerValue}% OFF
                                </span>
                              )}
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-end justify-between sm:items-center sm:gap-8 mt-auto sm:mt-0">
                           
                           {/* Price (Mobile Only) */}
                           <div className="flex flex-col sm:hidden">
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{product.productId?.offer
                                      ? calculatePrice(product.price, product?.productId?.offer.offerValue)
                                      : product.price}
                                </span>
                                {product.productId?.offer && (
                                  <span className="text-xs text-gray-400 line-through">₹{product?.price}</span>
                                )}
                           </div>

                           {/* Stepper */}
                           <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm">
                              <button
                                onClick={() => handleQuantity(product.productId._id, product.quantity - 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 active:scale-95 transition-all text-[10px] sm:text-xs disabled:opacity-50"
                                disabled={product.quantity <= 1}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="w-6 text-center font-bold text-xs sm:text-sm text-gray-900">{product.quantity}</span>
                              <button
                                onClick={() => handleQuantity(product.productId._id, product.quantity + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 active:scale-95 transition-all text-[10px] sm:text-xs disabled:opacity-50"
                                disabled={product.quantity >= 5}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                           </div>

                           {/* Price Desktop */}
                           <div className="hidden sm:flex flex-col items-end min-w-[80px]">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{product.productId?.offer
                                  ? calculatePrice(product.price, product?.productId?.offer.offerValue)
                                  : product.price}
                              </span>
                           </div>
                           
                           {/* Remove Button Desktop */}
                           <button
                              onClick={() => handleRemove(product.productId._id)}
                              className="hidden sm:block text-gray-300 hover:text-red-500 transition-colors p-2"
                              title="Remove"
                            >
                              <i className="fas fa-times text-lg"></i>
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Sidebar - Desktop */}
                <div className="hidden lg:block lg:w-[400px] shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-32">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="flex flex-col gap-4 mb-8">
                      <div className="flex justify-between text-gray-500 text-sm">
                        <span>Items ({cartData.totalQuantity})</span>
                        <span className="font-medium text-gray-900">₹{cartData.totalPriceAfterDiscount}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 text-sm">
                         <span>Shipping</span>
                         <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="h-px bg-gray-100 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-gray-900">₹{cartData.totalPriceAfterDiscount}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Including Taxes</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                      Process to Checkout
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-300">
                        <i className="fab fa-cc-visa text-2xl"></i>
                        <i className="fab fa-cc-mastercard text-2xl"></i>
                        <i className="fab fa-cc-paypal text-2xl"></i>
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Checkout Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100]">
                    {/* Collapsible Details Panel */}
                    <div className={`
                         bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] 
                         transition-all duration-300 ease-in-out overflow-hidden
                         ${showMobileDetails ? 'max-h-80 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
                    `}>
                        <div className="p-6 space-y-3">
                            <h3 className="font-bold text-gray-900 mb-4 font-serif text-lg">Price Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Price ({cartData.totalQuantity} items)</span>
                                    <span className="font-medium text-gray-900">₹{cartData.totalPriceAfterDiscount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping Charges</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <div className="flex justify-between items-center text-base">
                                    <span className="font-bold text-gray-900">Total Payable</span>
                                    <span className="font-bold text-gray-900">₹{cartData.totalPriceAfterDiscount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Bar */}
                    <div className="bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] relative z-20">
                        {/* Toggle Handle */}
                        <div 
                           onClick={() => setShowMobileDetails(!showMobileDetails)}
                           className="absolute -top-3 left-1/2 -translate-x-1/2 cursor-pointer bg-white border border-gray-200 shadow-sm rounded-full w-8 h-6 flex items-center justify-center hover:bg-gray-50 active:scale-95"
                        >
                           <i className={`fas fa-chevron-${showMobileDetails ? 'down' : 'up'} text-xs text-gray-400`}></i>
                        </div>

                        <div className="flex items-center gap-4 max-w-7xl mx-auto">
                            <div 
                                className="flex flex-col cursor-pointer active:opacity-70 transition-opacity"
                                onClick={() => setShowMobileDetails(!showMobileDetails)}
                            >
                                <span className="text-2xl font-bold text-gray-900 leading-none">₹{cartData.totalPriceAfterDiscount}</span>
                                <span className="text-[10px] text-black font-bold uppercase tracking-wider underline mt-1">
                                    {showMobileDetails ? 'Hide Details' : 'View Details'}
                                </span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                className="flex-1 bg-black text-white py-3.5 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                Place Order
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
export default CartPage;
