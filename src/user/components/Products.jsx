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

function Products({ filters, sortOption, productLimit, load }) {
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
      setIsLoading(false); // Reset loading state after fetch is complete
    }
  }

  // useEffect to fetch products
  useEffect(() => {
    setProducts([]);
    offset.current = 0;
    setHasMore(true);
    setIsIntersecting(false);
    fetchProducts(offset.current, true);
  }, [filters, sortOption]);

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
    console.log(originalPrice, products);
    return Math.floor(originalPrice - (originalPrice * offerValue) / 100);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-5 py-8 text-[25px]">
        {isProductsSuccess &&
          products.map((product) => {
            return (
              <Link to={`/productDetail/${product._id}`} key={product._id}>
                <div className="flex flex-col items-center max-w-[320px] py-2 px-4 shadow-md rounded-lg">
                  <div className="w-[280px] h-[280px] rounded-xl overflow-hidden">
                    <img
                      className="w-full h-full "
                      src={product.gallery[0]}
                      alt=""
                    />
                  </div>
                  <div className="w-full flex px-2 py-4 gap-4">
                    <div className="flex-1 flex flex-col gap-2 text-[#484848]">
                      <span className="text-[15px] font-bold truncate max-w-[188px]">
                        {product.productName}
                      </span>
                      <span className="text-[13px]">
                        (4.1k) Customer Reviews
                      </span>
                      <span className="text-[13px] px-2 py-1 bg-[#F0F0F0] w-fit rounded-full">
                        free delivery
                      </span>
                      {product?.offer ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold pt-2 text-[19px]">
                            ₹
                            {calculatePrice(
                              product.variants[0].price,
                              product?.offer.offerValue
                            )}
                          </span>
                          <span className="text-[15px] translate-y-1">
                            <span className="text-[#484848] line-through">₹{product.variants[0].price}</span>
                            <span className="text-green-600 ml-2">{product?.offer.offerValue}% off</span>
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold pt-2 text-[19px]">
                          ₹{product.variants[0].price}
                        </span>
                      )}
                    </div>
                    <div className="min-h-full flex flex-col justify-between pt-[10px] ">
                      <img src={stars} alt="" />
                      <div className="flex gap-4">
                        <img src={cart} alt="" />
                        <i
                          onClick={(e) => {
                            e.preventDefault();
                            handleWishList(product._id);
                          }}
                          className={`fa-${
                            wishList &&
                            wishList.some(
                              (val) => val.productId === product._id
                            )
                              ? "solid"
                              : "regular"
                          } fa-heart `}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      {hasMore && <div ref={endRef}>Loading...</div>}
    </div>
  );
}

export default Products;
