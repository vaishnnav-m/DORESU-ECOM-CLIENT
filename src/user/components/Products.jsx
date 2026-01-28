import stars from "../assets/stars.svg";
import cart from "../assets/Shopping cart.svg";
import {
  useAddWishListMutation,
  useGetWishListQuery,
  useLazyGetProuductsQuery,
} from "../../services/userProductsApi";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductSkeleton = () => (
  <div className="w-full max-w-[320px] mx-auto flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden">
    <div className="w-full aspect-[4/5] bg-gray-200 animate-pulse relative">
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3 left-3 w-20 h-5 bg-gray-300 rounded-md animate-pulse"></div>
    </div>
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
         <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
         <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="flex flex-col gap-1 w-1/3">
             <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

function Products({ filters, sortOption = '', productLimit, query = '', load }) {
  // states
  const limit = productLimit || 8;
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wishList, setWishList] = useState(null);

  // query to fetch products
  const [getProuducts, { isSuccess: isProductsSuccess }] =
    useLazyGetProuductsQuery();
  const [addWishList] = useAddWishListMutation();
  const { data: wishListData, refetch } = useGetWishListQuery();

  // reference to know end
  const endRef = useRef(null);
  const offset = useRef(0);

  async function fetchProducts(
    offsetValue = offset.current,
    currentHasMore = hasMore
  ) {
    if (isLoading || !currentHasMore) return;
    try {
      setIsLoading(true);
      const response = await getProuducts({
        offset: offsetValue,
        limit,
        category: filters.categories,
        priceRange: filters.priceRange,
        sortOption,
        query
      }).unwrap();

      if (response) {
        setProducts((prev) => {
          const newProducts = [...prev, ...response.data];
          // checking is there more products
          if (response.data.length < limit) {
            setHasMore(false);
          }
          return newProducts;
        });
        offset.current += limit;
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect to fetch products
  useEffect(() => {
    setProducts([]);
    offset.current = 0;
    setHasMore(true);
    setIsIntersecting(false);
    fetchProducts(offset.current, true);
  }, [filters, sortOption, query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 1 }
    );

    if (endRef.current) observer.observe(endRef.current);

    return () => {
      if (endRef.current) observer.unobserve(endRef.current);
    };
  }, [endRef]);

  useEffect(() => {
    if (isIntersecting && hasMore && load) {
      fetchProducts(offset.current);
    }
  }, [isIntersecting]);

  // wish list area
  async function handleWishList(productId) {
    try {
      const response = await addWishList({ productId }).unwrap();
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

  useEffect(() => {
    if (wishListData) setWishList(wishListData.data);
  }, [wishListData]);

  function calculatePrice(originalPrice, offerValue) {
    return Math.floor(originalPrice - (originalPrice * offerValue) / 100);
  }

  return (
    <div className="w-full">
      <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6`}>
        {products.map((product) => {
            return (
              <Link to={`/productDetail/${product._id}`} key={product._id} className="group w-full max-w-[320px] mx-auto flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
                
                {/* Image Section */}
                <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.gallery[0]}
                    alt={product.productName}
                  />
                  
                  {/* Wishlist Button - Overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishList(product._id);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all active:scale-95 group/btn"
                  >
                    <i
                      className={`text-lg fa-${
                        wishList && wishList.some((val) => val.productId === product._id)
                          ? "solid text-red-500"
                          : "regular text-gray-400 group-hover/btn:text-red-500"
                      } fa-heart transition-colors`}
                    ></i>
                  </button>

                  {/* Free Delivery Badge - Overlay */}
                  <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-[#484848] shadow-sm">
                    Free Delivery
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  {/* Title & Reviews */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-bold text-[#333] leading-tight line-clamp-1" title={product.productName}>
                      {product.productName}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#fca120] text-[12px] gap-0.5">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <span className="text-[12px] text-gray-400 font-medium">(4.1k reviews)</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                       {product?.offer ? (
                        <>
                          <div className="flex items-baseline gap-2">
                             <span className="text-[20px] font-bold text-[#222]">
                              ₹{calculatePrice(product.variants[0].price, product?.offer.offerValue)}
                             </span>
                             <span className="text-[13px] text-green-600 font-bold">
                               {product?.offer.offerValue}% OFF
                             </span>
                          </div>
                          <span className="text-[13px] text-gray-400 line-through decoration-gray-400">
                            ₹{product.variants[0].price}
                          </span>
                        </>
                      ) : (
                        <span className="text-[20px] font-bold text-[#222]">
                          ₹{product.variants[0].price}
                        </span>
                      )}
                    </div>

                    <button 
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-[#333] transition-colors active:scale-95 shadow-lg group-hover:shadow-xl"
                      title="Add to Cart"
                    >
                      <img src={cart} className="w-5 h-5 invert brightness-0 filter" alt="Add to cart" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}

          {isLoading && (
             Array(products.length === 0 ? limit : 4).fill(0).map((_, i) => <ProductSkeleton key={`skeleton-${i}`} />)
          )}

          {!isLoading && products.length === 0 && (
            <div className="w-full col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
               <i className="fas fa-box-open text-6xl mb-4 opacity-50"></i>
               <span className="text-xl font-medium">No Products Found</span>
               <p className="text-sm">Try changing your filters</p>
            </div>
          )}
      </div>
      
      {/* Invisible sentinel for infinite scroll */}
      {(hasMore && load) && <div ref={endRef} className="h-4 w-full" />}
    </div>
  );
}

export default Products;
