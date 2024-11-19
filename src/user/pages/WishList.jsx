import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useAddToCartMutation, useAddWishListMutation, useGetWishListQuery } from "../../services/userProductsApi";
import { useNavigate } from "react-router-dom";

function WishList() {
  const { data: wishListData, isSuccess,refetch } = useGetWishListQuery();
  const [addToCart] = useAddToCartMutation();
  const [addToWishList] = useAddWishListMutation();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (wishListData) setProducts(wishListData.data);
  }, [wishListData]);

  const handleCart = async (productId,size) => {
   try {
      console.log(productId,size);
     const response = await addToCart({productId,size,quantity:1}).unwrap();
     if(response){
       navigate('/cart')
     }
   } catch (error) {
     toast.error(error.data.message,{
       position: "top-right",
       theme: "dark",
     })
   }
 }

 async function handleWishList(productId) {
   try {
     const response = await addToWishList({ productId }).unwrap();
     if (response) {
       toast.success(response.message, {
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[200px]">
      <Header />
      <main className="w-[60%] flex items-center gap-10 shadow-xl py-10 px-10">
        <div className="flex-1 ">
          <table className="w-full table-fixed">
            {isSuccess && (
              <tbody>
                {products?.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={index}
                      className="px-6 py-4 text-center  border-b border-gray-300"
                    >
                      <td className="px-8 py-4">
                        <div className="flex  gap-10">
                          <div className="w-[95px] h-[125px] flex-shrink-0">
                            <img
                              className="w-full h-full"
                              src={product.gallery}
                              alt="product Image"
                            />
                          </div>
                          <div className=" flex flex-col justify-between py-2 text-start">
                            <div className="w-full flex flex-col gap-5">
                              <span className="truncate max-w-[300px] font-semibold">
                                {product.productName}
                              </span>
                              <span className="text-[25px] font-bold">
                                 ₹ {product.price}
                              </span>
                            </div>
                           {!product.stock && <span className="text-red-500 text-[16px]">out of stock</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex justify-center gap-5">
                           <span onClick={() => handleWishList(product.productId)} className="pl-[8px] cursor-pointer">
                           <i className="fas fa-x"></i> <span>Remove</span>
                           </span>
                           <button disabled={!product.stock} onClick={() => handleCart(product.productId,product.size)} className={`${!product.stock && "text-[#5f5f5f] cursor-not-allowed"}`}>
                           <i className="fas fa-cart-shopping"></i>{" "}
                           <span>Add to Cart</span>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center t">
                      <div>
                        <h2 className="text-[32px] font-semibold">
                          Your wishlist is empty !
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
      </main>
      <ToastContainer />
    </div>
  );
}

export default WishList;
