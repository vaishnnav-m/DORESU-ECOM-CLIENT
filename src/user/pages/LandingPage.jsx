import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import card1 from "../assets/Group 4346.jpg";
import card2 from "../assets/Group 4347.jpg";
import card3 from "../assets/images.jpg";
import card4 from "../assets/images (1).jpg";
import logos from "../assets/logos.svg";
import cardTxt from "../assets/ultimateSale.svg";
import banner2img from "../assets/image.jpg";
import paginationActive from "../assets/Active.svg";
import paginationNonActive from "../assets/Ellipse 1.svg";
import "./pageStyles.css";
import Products from "../components/Products";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const [time, setTime] = useState({
    days: 0,
    hours: 6,
    minutes: 5,
    seconds: 3,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        // Decrease seconds
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          // Decrease minutes
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            // Decrease hours
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              // Decrease days
              if (days > 0) {
                days -= 1;
              } else {
                // Timer ends
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // useMemo
  const filters = useMemo(
    () => ({
      categories: "All",
      priceRange: "All",
    }),
    []
  );

  const sortOption = useMemo(() => "", []);
  const query = useMemo(() => "", []);
  return (
    <div className="w-full bg-white overflow-x-hidden pt-20">
      <Header />
      
      {/* Hero Section - Professional & Compact */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 h-auto md:h-[600px]">
          
          {/* Left Hero - Slimmer */}
          <div className="hidden md:block md:col-span-3 h-full">
            <div className="w-full h-full rounded-2xl overflow-hidden relative group cursor-pointer">
               <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={card1} alt="Fashion Model" />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

          {/* Center Content - Focused */}
          <div className="col-span-1 md:col-span-6 flex flex-col gap-4 h-full">
            <div className="flex-1 rounded-2xl overflow-hidden relative group shadow-sm">
              <img className="w-full h-full object-cover" src={card3} alt="Main Fashion" />
              {/* Overlay Text - Professional Typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end items-center pb-10 text-white text-center p-6">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-tight font-serif">Ultimate Spring Sale</h1>
                  <p className="text-gray-200 text-sm md:text-base font-medium mb-6 opacity-90 max-w-sm">
                    Discover the season's finest collection. Elevate your wardrobe with premium essentials.
                  </p>
                  <button
                    onClick={() => navigate("/all")}
                    className="px-8 py-3 bg-white text-black rounded-full text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Shop Collection
                  </button>
              </div>
            </div>
            
            {/* Secondary Banner for MD */}
            <div className="h-1/3 hidden md:block rounded-2xl relative overflow-hidden">
                <img className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" src={card4} alt="Collection" />
                <div className="absolute bottom-4 left-4">
                     <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">New Arrivals</span>
                </div>
            </div>
          </div>

          {/* Right Hero - Slimmer */}
          <div className="hidden md:block md:col-span-3 h-full pt-12">
             <div className="w-full h-full rounded-2xl overflow-hidden relative group cursor-pointer">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={card2} alt="Style" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
             </div>
          </div>
        </div>

        {/* Brand Logos - Minimalist Bar */}
        <div className="w-full mt-12 border-y border-gray-100 py-6 flex justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
          <img src={logos} alt="Brands" className="h-5 md:h-7 grayscale filter" />
        </div>
      </main>

      {/* Deals Section - Clean & Sophisticated */}
      <section className="bg-gray-50/50 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col lg:flex-row h-full">
                {/* Content */}
                <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center gap-6">
                   <div>
                      <div className="flex items-center gap-2 mb-3">
                          <span className="w-8 h-[2px] bg-red-500 block"></span>
                          <span className="text-xs font-bold uppercase tracking-widest text-red-500">Deal of the Day</span>
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-serif leading-tight">Exclusive Spring Offer</h2>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                        Get 30% off on our latest spring collection. Premium quality meets unbeatable prices. Offer valid for a limited time.
                      </p>
                   </div>

                   {/* Timer - Professional Mono Look */}
                   <div className="flex gap-4">
                      {[
                        { val: time.days, label: "Days" },
                        { val: time.hours, label: "Hours" },
                        { val: time.minutes, label: "Mins" },
                        { val: time.seconds, label: "Secs" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                           <div className="text-3xl font-mono font-medium text-gray-900">
                              {String(item.val).padStart(2, "0")}
                              <span className="text-gray-300 mx-1 font-light text-xl">:</span>
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-2">
                       <button className="px-8 py-3 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">
                        Buy Now
                      </button>
                   </div>
                </div>

                {/* Image */}
                <div className="relative h-64 lg:h-auto lg:w-1/2 overflow-hidden">
                   <img className="absolute inset-0 w-full h-full object-cover" src={banner2img} alt="Deal Banner" />
                   <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded shadow-sm border border-gray-100">
                      <span className="font-bold text-sm tracking-widest text-gray-900">30% OFF</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* New Arrivals - Tighter Layout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">New Arrivals</h2>
          <div className="w-12 h-1 bg-black mb-4"></div>
          <p className="text-gray-500 text-sm max-w-lg">
             Explore our latest additions. Curated styles for the modern wardrobe.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <div className="min-h-[400px]">
            <Products
                filters={filters}
                load={false}
                sortOption={sortOption}
                query={query}
                productLimit={4}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button onClick={() => navigate("/all")} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-8 py-3 hover:bg-black hover:text-white transition-all rounded">
                View All Products
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
