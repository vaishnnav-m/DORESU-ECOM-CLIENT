import React from "react";
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

function LandingPage() {
  return (
    <div>
      <Header />
      <main className="px-[15%] flex flex-col items-center gap-20 py-28 ">
        <div className="grid grid-cols-3 gap-10 w-full">
          <div>
            <img className="w-full" src={card1} alt="" />
          </div>
          <div className="flex flex-col justify-between">
            <img className="w-full" src={card3} alt="" />

            <div className="flex flex-col gap-5 items-center">
              <img className="w-[370px] banner-txt" src={cardTxt} alt="" />
              <button className="uppercase px-[70px] py-3 text-white text-[13px] bg-black rounded-lg">
                Shop Now
              </button>
            </div>

            <img className="w-full" src={card4} alt="" />
          </div>
          <div>
            <img className="w-full" src={card2} alt="" />
          </div>
        </div>
        <div className="w-full h-[60px] bg-white shadow-lg shadow-[#f0f0f0] flex justify-center ">
          <img src={logos} alt="" />
        </div>
      </main>

      <section className="bg-gradient-to-t from-[#E2E2E2] to-white w-full flex justify-center">
        <div className="max-w-[1000px] flex gap-[136px] py-5">
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="flex flex-col gap-[30px] py-3">
              <h2 className="text-[40px] font-volkhov text-[#484848]">
                Deals Of The Day
              </h2>
              <span className="text-[15px] text-[#8A8A8A]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque
                duis ultrices sollicitudin{" "}
              </span>
              <button className="uppercase px-[70px] py-3 max-w-fit text-white text-[13px] bg-black rounded-lg">
                Buy Now
              </button>
            </div>

            <div className="flex gap-5">
              <div className="text-center flex flex-col gap-3">
                <div className="w-[60px] h-[70px] rounded-lg flex  justify-center text-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] text-[40px]">
                    00
                  </span>
                </div>
                <span className="text-[14px]">Days</span>
              </div>
              <div className="text-center flex flex-col gap-3">
                <div className="w-[60px] h-[70px] rounded-lg flex  justify-center text-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] text-[40px]">
                    06
                  </span>
                </div>
                <span className="text-[14px]">Hr</span>
              </div>
              <div className="text-center flex flex-col gap-3">
                <div className="w-[60px] h-[70px] rounded-lg flex  justify-center text-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] text-[40px]">
                    05
                  </span>
                </div>
                <span className="text-[14px]">Min</span>
              </div>

              <div className="text-center flex flex-col gap-3">
                <div className="w-[60px] h-[70px] rounded-lg flex  justify-center text-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] text-[40px]">
                    03
                  </span>
                </div>
                <span className="text-[14px]">Sec</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-xl overflow-hidden relative">
              <img className="w-full h-full" src={banner2img} alt="" />
              <div className="w-[137px] h-[78px] bg-white absolute left-5 bottom-5 text-center flex flex-col justify-between py-3">
                <span className="text-[12px]">
                  01{" "}
                  <hr className="w-[20px] h-[2px] bg-black inline-block -translate-y-[4px]" />{" "}
                  Spring Sale
                </span>
                <span className="text-[20px]">30% OFF</span>
              </div>
            </div>
            <div className="flex gap-5 w-full py-3 justify-center">
              <img src={paginationActive} alt="" />
              <img src={paginationNonActive} alt="" />
              <img src={paginationNonActive} alt="" />
              <img src={paginationNonActive} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[79px] flex flex-col items-center ">
        <div className="text-center max-w-[30%]">
          <h2 className="text-[40px] font-volkhov text-[#484848] mb-[45px]">
            New Arrivals
          </h2>
          <span className="text-[#8A8A8A]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin
          </span>
        </div>
        <div className="max-w-[70%]">
          <div className="w-full flex justify-between pt-14 px-[50px]">
            <button className="uppercase px-[70px] py-3 max-w-fit text-white text-[13px] bg-black rounded-lg">
              Men's Fashion
            </button>
            <button className="uppercase px-[70px] py-3 max-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              T-shirts
            </button>
            <button className="uppercase px-[70px] py-3 max-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Shirts
            </button>
            <button className="uppercase px-[70px] py-3 max-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Hoodies
            </button>
            <button className="uppercase px-[70px] py-3 max-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Hoodies
            </button>
          </div>
          <Products
            filters={{
              categories: "All",
              priceRange: "All",
            }}
            load={false}
          />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
