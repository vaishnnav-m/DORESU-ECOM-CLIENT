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

function CartPage() {
  const { data: cart, isSuccess, refetch } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeCartProduct] = useRemoveCartProductMutation();

  const [cartData, setCartData] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      console.log(cart);
      setCartData(cart.data);
      setProducts(cart.data.products);
    }
  }, [cart]);

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
      return toast.error("max limit reached", {
        position: "top-right",
        theme: "dark",
      });
    }
    if (newQuantity < 1) {
      return toast.error("Atleast one product is needed", {
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
      const invalidProducts = cart.data.products.filter(
        (product) => product.quantityLeft === 0
      );
      if (invalidProducts.length > 0) {
        return toast.error("insufficient quantity", {
          position: "top-right",
          theme: "dark",
        });
      }
      navigate("/payment")
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[200px]">
      <Header />
      <main className="w-[70%] flex items-center gap-10 shadow-xl py-10 px-10">
        <div className="flex-1 ">
          <table className="w-full table-fixed">
            {isSuccess && (
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={index}
                      className="px-6 py-4 text-center  border-b border-gray-300"
                    >
                      <td className="px-8 py-4">
                        <div className="flex gap-10">
                          <div className="w-[95px] h-[125px] flex-shrink-0">
                            <img
                              className="w-full h-full"
                              src={product.productId.gallery}
                              alt="product Image"
                            />
                          </div>
                          <div className=" flex flex-col justify-between py-2 text-start">
                            <div className="w-full flex flex-col gap-1">
                              <span className="truncate max-w-[230px] font-semibold">
                                {product.productId.productName}
                              </span>
                              <span className="text-[16px] text-[#4a4a4a] pl-1">
                                size: {product.size}
                              </span>
                            </div>
                            <span
                              onClick={() =>
                                handleRemove(product.productId._id)
                              }
                              className="pl-[8px] cursor-pointer"
                            >
                              <i className="fas fa-x"></i> <span>Remove</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 ">
                        <span className="text-[25px] font-bold mr-3">
                          ₹{" "}
                          {product.productId?.offer
                            ? calculatePrice(
                                product.price,
                                product?.productId?.offer.offerValue
                              )
                            : product.price}
                        </span>
                        {product.productId?.offer && (
                          <span>
                            <span className="text-[#8A8A8A] text-[18px] line-through">
                              ₹{product?.price}
                            </span>
                            <span className="text-green-600 ml-2">
                              {product?.productId?.offer.offerValue}% off
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-4 ">
                        <div className="flex items-center gap-4">
                          <i
                            onClick={() =>
                              handleQuantity(
                                product.productId._id,
                                product.quantity - 1
                              )
                            }
                            className="fas fa-minus cursor-pointer"
                          ></i>
                          <input
                            className="w-[72px] h-[38px] px- text-center border border-black"
                            type="text"
                            value={product.quantity}
                            disabled
                          />
                          <i
                            onClick={() =>
                              handleQuantity(
                                product.productId._id,
                                product.quantity + 1
                              )
                            }
                            className="fas fa-plus cursor-pointer"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center t">
                      <div>
                        <h2 className="text-[32px] font-semibold">
                          Your cart is empty !
                        </h2>
                        <button
                          className="bg-[black] text-white px-5 py-2 rounded-lg mt-5"
                          onClick={() => navigate("/all")}
                        >
                          Find Products
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
        <div className="border border-black flex flex-col rounded-xl gap-10 p-10">
          <span className="text-[25px] font-semibold">
            Sub Total ({cartData.totalQuantity} item):₹{" "}
            {cartData.totalPriceAfterDiscount}
          </span>
          <button
            onClick={handleCheckout}
            className="bg-black text-white px-5 text-2xl py-2 rounded-lg"
          >
            Check Out
          </button>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default CartPage;
