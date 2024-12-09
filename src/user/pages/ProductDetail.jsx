import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import ReactImageMagnify from "react-image-magnify";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import InnerImageZoom from 'react-inner-image-zoom'
import "./pageStyles.css";

import Header from "../components/Header";
import stars from "../assets/stars.svg";
import {
  useAddToCartMutation,
  useGetProductQuery,
} from "../../services/userProductsApi";
import "./pageStyles.css";
import Products from "../components/Products";

function ProductDetail() {
  const { productId } = useParams();
  const { data: product } = useGetProductQuery(productId);
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVarientIndex, setSelctedVarientIndex] = useState(0);
  const [addToCart] = useAddToCartMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product && product.data) {
      setProductData(product?.data);
      setMainImage(product.data.gallery[0].url);
    }
  }, [product]);
  const getShortenedSize = (size) => {
    switch (size.toLowerCase()) {
      case "medium":
        return "M";
      case "small":
        return "S";
      case "large":
        return "L";
      case "extra large":
        return "XL";
      default:
        return size;
    }
  };

  // to fix the scroll bug
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const handleCart = async () => {
    try {
      const response = await addToCart({
        productId,
        size: productData.variants[selectedVarientIndex].size,
        quantity: 1,
      }).unwrap();
      if (response) {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message, {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  function calculatePrice(originalPrice) {
    return Math.floor(
      originalPrice - (originalPrice * productData?.offer.offerValue) / 100
    );
  }

  return (
    <div className="pt-[100px]">
      <Header />
      {!productData?.isActive ? (
        <div className=" w-full h-screen flex justify-center items-center">
          <span>product not found</span>
        </div>
      ) : (
        <main className="w-full flex flex-col py-20 gap-20 items-center">
          <div className="flex gap-5 w-[100%] max-w-[70%]">
            <div className="flex-1 flex gap-3">
              <div className="max-w-[100px] flex flex-col gap-2">
                {productData?.gallery.map((product, index) => (
                  <div key={index}>
                    <img
                      onMouseEnter={() => setMainImage(product.url)}
                      src={product.url}
                      alt=""
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex overflow-hidden justify-center min-w-full h-[472px] border">
                  {/* <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: "main image",
                        isFluidWidth: false,
                        width: 400,
                        height: 472,
                        src: mainImage,
                      },
                      largeImage: {
                        src: mainImage,
                        width: 1200,
                        height: 1800,
                      },
                      shouldUsePositiveSpaceLens: true,
                      enlargedImageContainerDimensions: {
                        width: "200%",
                        height: "100%",
                      },
                      enlargedImagePosition: "beside",
                    }}
                  /> */}
                  <InnerImageZoom  className="object-contain min-w-full min-h-[472px]" src={mainImage} />
                </div>
                <div className="w-full flex gap-5 text-20px] font-bold">
                  <button
                    onClick={handleCart}
                    disabled={
                      productData?.variants[selectedVarientIndex].stock === 0
                    }
                    className="w-full py-4 border border-black flex gap-3 justify-center items-center rounded-xl"
                  >
                    <i className="fas fa-cart-shopping"></i>Add to Cart
                  </button>
                  <button
                    disabled={
                      productData?.variants[selectedVarientIndex].stock === 0
                    }
                    className="w-full py-4 bg-black text-white rounded-xl"
                  >
                    Buy Now
                  </button>
                </div>
                {productData?.variants[selectedVarientIndex].stock === 0 && (
                  <span className="text-red-500 text-[20px]">out of stock</span>
                )}
                {productData?.variants[selectedVarientIndex].stock <= 10 &&
                  productData?.variants[selectedVarientIndex].stock > 0 && (
                    <span className="text-red-400 text-[20px]">
                      {productData?.variants[selectedVarientIndex].stock} left
                      hurry !
                    </span>
                  )}
              </div>
            </div>
            <div className="flex-1 flex items-center flex-col gap-5">
              <span className="w-full flex items-center gap-2 text-[15px] text-[#8A8A8A] uppercase">
                <Link to="/">home</Link> <i className="fas fa-angle-right"></i>{" "}
                productDeatails
              </span>
              <div className="w-full border rounded-xl p-5 flex flex-col shadow-lg gap-2">
                <span className="text-[18px] font-semibold text-[#8A8A8A] uppercase">
                  {productData?.productName}
                </span>
                {productData?.offer ? (
                  <>
                    <h2 className="text-[32px] font-bold">
                      ₹{" "}
                      {calculatePrice(
                        productData?.variants[selectedVarientIndex].price
                      )}
                    </h2>
                    <span>
                      <span className="text-[#8A8A8A] text-[18px] line-through">
                        ₹{productData?.variants[selectedVarientIndex].price}
                      </span>
                      <span className="text-green-600 ml-2">
                        {productData?.offer.offerValue}% off
                      </span>
                    </span>
                  </>
                ) : (
                  <h2 className="text-[32px] font-bold">
                    ₹ {productData?.variants[selectedVarientIndex].price}
                  </h2>
                )}
                <div className="flex gap-2 items-center">
                  <img src={stars} alt="" />
                  <span className="text-[13px] text-[#8A8A8A] pt-2">
                    (4.1k) Customer Reviews
                  </span>
                </div>
                <span className="text-[13px] px-2 py-1 bg-[#F0F0F0] w-fit rounded-full">
                  free delivery
                </span>
              </div>
              <div className="w-full border rounded-xl p-5 flex flex-col shadow-lg gap-2">
                <span className="text-[18px]">Select Size</span>
                <div className="flex gap-3">
                  {productData?.variants.map((variant, index) => {
                    return (
                      <button
                        onClick={() => setSelctedVarientIndex(index)}
                        key={index}
                        style={
                          selectedVarientIndex === index
                            ? {
                                backgroundColor: "#e9e9e9",
                                border: "1px solid",
                              }
                            : {}
                        }
                        className="w-fit p-5 border border-[#b8b8b8] rounded-xl"
                      >
                        {getShortenedSize(variant.size)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="w-full border rounded-xl p-5 flex flex-col shadow-lg gap-2 text-[#8A8A8A]">
                <span className="text-[18px] text-black">Product Details</span>
                <span>Name:{productData?.productName}</span>
                <span>Net Quantity (N) :1</span>
                <span>
                  Sizes:{" "}
                  {productData?.variants.map(
                    (variant) => getShortenedSize(variant.size) + " "
                  )}
                </span>
                <span>{productData?.description}</span>
                <span>Country of Origin : India</span>
                <span>More Information</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-5 min-w-[70%]">
            <div className="min-w-fit">
              <span className="text-[18px] font-semibold">
                Write the product review
              </span>
              <button className="w-full mt-2 flex justify-center items-center gap-2 border p-2">
                <i className="fas fa-plus"></i>
                <span className="text-nowrap">Add Review</span>
              </button>
            </div>
            <div className="w-full flex gap-20">
              <div className="border flex-1 p-5 flex flex-col gap-5 ">
                <div className="text-[#fca120]">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <span className="text-[20px] font-bold block">
                    Review Title
                  </span>
                  <span className="text-[16px]">Review Body</span>
                </div>
                <div>
                  <img src="" alt="" />
                  <span>
                    <span className="text-[14px] text-[#8A8A8A] font-semibold block">
                      Reviewer Name
                    </span>
                    <span className="text-[12] text-[#8A8A8A]">date</span>
                  </span>
                </div>
              </div>
              <div className="border flex-1 p-5 flex flex-col gap-5">
                <div className="text-[#fca120]">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
                <div>
                  <span className="text-[20px] font-bold block">
                    Review Title
                  </span>
                  <span className="text-[16px]">Review Body</span>
                </div>
                <div>
                  <img src="" alt="" />
                  <span>
                    <span className="text-[14px] text-[#8A8A8A] font-semibold block">
                      Reviewer Name
                    </span>
                    <span className="text-[12] text-[#8A8A8A]">date</span>
                  </span>
                </div>
              </div>
              <div className="border flex-1 p-5 flex flex-col gap-5">
                <div className="text-[#fca120]">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
                <div>
                  <span className="text-[20px] font-bold block">
                    Review Title
                  </span>
                  <span className="text-[16px]">Review Body</span>
                </div>
                <div>
                  <img src="" alt="" />
                  <span>
                    <span className="text-[14px] text-[#8A8A8A] font-semibold block">
                      Reviewer Name
                    </span>
                    <span className="text-[12] text-[#8A8A8A]">date</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[100%]">
              <h2 className="text-[20px] font-semibold">Similar Products</h2>
              <Products />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default ProductDetail;
