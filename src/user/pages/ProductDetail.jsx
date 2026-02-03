import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./pageStyles.css";

import Header from "../components/Header";
import {
  useAddToCartMutation,
  useGetProductQuery,
} from "../../services/userProductsApi";
import Products from "../components/Products";

// Custom Lightbox Component
const ImageModal = ({ src, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col animate-in fade-in duration-200">
      {/* Close Button */}
      <div className="absolute top-0 right-0 p-4 z-50 flex gap-4 pointer-events-none">
        <button
          onClick={onClose}
          className="pointer-events-auto bg-black/5 hover:bg-black/10 text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Image Container */}
      <div
        className={`flex-1 w-full h-full flex items-center justify-center overflow-auto ${isZoomed ? 'cursor-zoom-out items-start justify-start' : 'cursor-zoom-in'}`}
        onClick={toggleZoom}
      >
        <img
          src={src}
          alt="Zoomed Product"
          className={`transition-all duration-300 ease-out select-none ${isZoomed
              ? "min-w-[150vw] min-h-[150vh] object-contain max-w-none"
              : "w-full h-full object-contain p-4 lg:p-10"
            }`}
          style={isZoomed ? { transform: 'scale(1)' } : {}}
        />
      </div>

      {/* Hint */}
      {!isZoomed && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md pointer-events-none">
          Click to Zoom
        </div>
      )}
    </div>
  );
};

function ProductDetail() {
  const { productId } = useParams();
  const { data: product } = useGetProductQuery(productId);
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVarientIndex, setSelctedVarientIndex] = useState(0);
  const [addToCart] = useAddToCartMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (!productData) return;
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
      toast.error(error?.data?.message || "Failed to add to cart", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  function calculatePrice(originalPrice) {
    if (!originalPrice) return 0;
    return Math.floor(
      originalPrice - (originalPrice * (productData?.offer?.offerValue || 0)) / 100
    );
  }

  return (
    <div className="pt-[100px] min-h-screen bg-gray-50/50">
      <Header />
      {isModalOpen && (
        <ImageModal src={mainImage} onClose={() => setIsModalOpen(false)} />
      )}

      {!productData?.isActive ? (
        <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4 text-gray-500">
          <i className="fas fa-search text-4xl mb-2 opacity-50"></i>
          <span className="text-xl font-medium">Product not found</span>
          <Link to="/" className="text-black underline hover:text-gray-700 transition-colors">
            Go back shopping
          </Link>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
          {/* Breadcrumbs */}
          <div className="w-full flex items-center gap-2 text-xs md:text-sm text-gray-500 uppercase font-medium mb-6 md:mb-10">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{productData?.productName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left Column: Image Gallery */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] hide-scroll py-2 lg:py-0 order-2 lg:order-1">
                {productData?.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img.url)}
                    onMouseEnter={() => setMainImage(img.url)}
                    className={`relative min-w-[70px] w-[70px] h-[70px] lg:w-[80px] lg:h-[100px] rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${mainImage === img.url
                        ? "border-black ring-1 ring-black/10 opacity-100"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group z-10 order-1 lg:order-2">
                <div
                  className="w-full h-full flex items-center justify-center bg-white min-h-[300px] md:min-h-[500px] lg:min-h-[600px] cursor-zoom-in"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img
                    className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                    src={mainImage || ""}
                    alt={productData?.productName}
                  />

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                      <i className="fas fa-expand mr-2"></i>Click to Zoom
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col gap-6 md:gap-8 pb-24 lg:pb-0">
              {/* Title & Price */}
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:pb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                  {productData?.productName}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1 text-yellow-400 text-sm">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <span className="text-sm text-gray-500 font-medium hover:text-black cursor-pointer transition-colors underline decoration-gray-300 underline-offset-4">
                    4.2 (412 reviews)
                  </span>
                </div>

                <div className="flex items-end gap-3 mt-2">
                  {productData?.offer ? (
                    <>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        ₹
                        {calculatePrice(
                          productData?.variants[selectedVarientIndex]?.price || 0
                        )}
                      </h2>
                      <div className="flex flex-col mb-1">
                        <span className="text-lg text-gray-400 line-through font-medium">
                          ₹{productData?.variants[selectedVarientIndex]?.price}
                        </span>
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit">
                          {productData?.offer.offerValue}% OFF
                        </span>
                      </div>
                    </>
                  ) : (
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      ₹{productData?.variants[selectedVarientIndex]?.price}
                    </h2>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-full w-fit mt-2">
                  <i className="fas fa-truck text-xs text-black"></i>
                  <span>Free Delivery & Returns</span>
                </div>
              </div>

              {/* Sizes */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Select Size</span>
                  <button className="text-xs font-semibold text-gray-500 underline hover:text-black transition-colors">
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {productData?.variants.map((variant, index) => {
                    const isSelected = selectedVarientIndex === index;
                    const isOutOfStock = variant.stock === 0;
                    return (
                      <button
                        onClick={() => !isOutOfStock && setSelctedVarientIndex(index)}
                        disabled={isOutOfStock}
                        key={index}
                        className={`
                          min-w-[50px] md:min-w-[60px] h-[45px] md:h-[50px] px-3 md:px-4 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border
                          ${isSelected
                            ? "bg-black text-white border-black shadow-lg shadow-black/20 transform scale-105"
                            : isOutOfStock
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice line-through"
                              : "bg-white text-gray-700 border-gray-200 hover:border-black hover:bg-gray-50"
                          }
                        `}
                      >
                        {getShortenedSize(variant.size)}
                      </button>
                    );
                  })}
                </div>
                {(productData?.variants[selectedVarientIndex]?.stock <= 10 && productData?.variants[selectedVarientIndex]?.stock > 0) && (
                  <div className="text-red-500 text-sm font-medium animate-pulse flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    Only {productData?.variants[selectedVarientIndex]?.stock} left in stock - order soon!
                  </div>
                )}
                {productData?.variants[selectedVarientIndex]?.stock === 0 && (
                  <div className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-times-circle"></i>
                    Currently out of stock
                  </div>
                )}
              </div>

              {/* Actions - Sticky on Mobile */}
              <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex gap-4 sm:static sm:bg-transparent sm:border-0 sm:shadow-none sm:p-0 sm:flex-col sm:gap-4 md:flex-row mt-0 sm:mt-6">
                <button
                  onClick={handleCart}
                  disabled={productData?.variants[selectedVarientIndex]?.stock === 0}
                  className="flex-1 py-3 px-4 sm:py-4 sm:px-6 border border-gray-300 text-black font-bold text-base sm:text-lg rounded-xl hover:border-black hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                >
                  <i className="fas fa-shopping-bag"></i>
                  <span className="whitespace-nowrap">Add to Cart</span>
                </button>
                <button
                  disabled={productData?.variants[selectedVarientIndex]?.stock === 0}
                  className="flex-1 py-3 px-4 sm:py-4 sm:px-6 bg-black text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-black/10 hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>

              {/* Description Accordion/Details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-4">
                <h3 className="font-bold text-lg mb-4 text-gray-900 border-b border-gray-100 pb-3">Product Details</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-2">
                    <span className="font-medium text-gray-900">Material</span>
                    <span>Premium Cotton Blend</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-2">
                    <span className="font-medium text-gray-900">Pattern</span>
                    <span>Solid</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-2">
                    <span className="font-medium text-gray-900">Country</span>
                    <span>India</span>
                  </div>
                  <div className="pt-2 leading-relaxed border-t border-gray-100 mt-2">
                    {productData?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 mb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <p className="text-gray-500 text-sm mt-1">What our customers are saying</p>
              </div>
              <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-all flex items-center gap-2">
                <i className="fas fa-pen"></i> Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex gap-1 text-yellow-400 text-sm mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Absolutely love it!</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    Great quality and fits perfectly. The material feels very premium for the price. Would definitely recommend to anyone looking for this style.
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 border border-white shadow-sm">
                      JD
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">Jane Doe</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Verified Buyer • Oct 12, 2023</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Products */}
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <Products />
          </div>
        </main>
      )}
    </div>
  );
}

export default ProductDetail;
