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
    <div>
      <Header />
      <main className="md:px-[15%] px-[10%] md:py-28 py-24 flex flex-col items-center md:gap-20 gap-5">
        <div className="grid grid-cols-3 md:gap-10 gap-4 w-full">
          <div>
            <img className="w-full" src={card1} alt="" />
          </div>
          <div className="flex flex-col justify-between">
            <img className="w-full" src={card3} alt="" />
            <div className="flex flex-col md:gap-5 gap-2 items-center">
              <img className="md:w-[370px] banner-txt" src={cardTxt} alt="" />
              <button
                onClick={() => navigate("/all")}
                className="uppercase lg:px-[4.3rem] md:px-[2.3rem] px-[0.7rem] md:py-3 py-[0.3rem] text-white lg:text-[13px] md:text-[10px] text-[6px] bg-black md:rounded-lg rounded-[5px]"
              >
                Shop Now
              </button>
            </div>
            <img className="w-full" src={card4} alt="" />
          </div>
          <div>
            <img className="w-full object-contain" src={card2} alt="" />
          </div>
        </div>
        <div className="w-full h-[60px] bg-white shadow-lg shadow-[#f0f0f0] flex justify-center ">
          <img src={logos} alt="" />
        </div>
      </main>

      <section className="bg-gradient-to-t from-[#E2E2E2] to-white w-full flex justify-center">
        <div className="2xl:max-w-[60%] xl:max-w-[70%] max-w-[83%] flex justify-between py-5 lg:px-16">
          <div className="flex-1 flex flex-col justify-between lg:gap-5 2xl:py-10 xl:py-5 lg:py-3">
            <div className="flex flex-col xl:gap-[30px] lg:gap-6 xl:py-3">
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
                <div className="xl:px-3 xl:min-w-[60px] xl:h-[70px] lg:min-w-[55px] lg:min-h-[65px]  rounded-lg flex  justify-center items-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] xl:text-[40px] lg:text-[35px]">
                    {String(time.days).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[14px]">Days</span>
              </div>
              <div className="text-center flex flex-col gap-3">
                <div className="xl:px-3 xl:min-w-[60px] xl:h-[70px] lg:min-w-[55px] lg:min-h-[65px]  rounded-lg flex  justify-center items-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] xl:text-[40px] lg:text-[35px]">
                    {String(time.hours).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[14px]">Hr</span>
              </div>
              <div className="text-center flex flex-col gap-3">
                <div className="xl:px-3 xl:min-w-[60px] xl:h-[70px] lg:min-w-[55px] lg:min-h-[65px]  rounded-lg flex  justify-center items-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] xl:text-[40px] lg:text-[35px]">
                    {String(time.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[14px]">Min</span>
              </div>

              <div className="text-center flex flex-col gap-3">
                <div className="xl:px-3 xl:min-w-[60px] xl:h-[70px] lg:min-w-[55px] lg:min-h-[65px]  rounded-lg flex  justify-center items-center bg-white shadow-lg">
                  <span className="font-digital text-[#484848] xl:text-[40px] lg:text-[35px]">
                    {String(time.seconds).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[14px]">Sec</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-end">
            <div className="rounded-xl overflow-hidden relative xl:w-[84%] lg:w-[90%]">
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
        <div className="text-center xl:max-w-[30%] lg:max-w-[41%]">
          <h2 className="text-[40px] font-volkhov text-[#484848] xl:mb-[45px] lg:mb-[24px]">
            New Arrivals
          </h2>
          <span className="text-[#8A8A8A]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin
          </span>
        </div>
        <div className="xl:max-w-[70%] max-w-[80%]">
          <div className="w-full flex  gap-5 pt-14 2xl:px-[50px] xl:px-[40px] lg:px-[30px]">
            <button className="flex-1 uppercase 2xl:px-[70px] xl:px-[50px] py-3 min-w-fit text-white text-[13px] bg-black rounded-lg">
              Men's Fashion
            </button>
            <button className="flex-1 uppercase 2xl:px-[70px] xl:px-[50px] py-3 min-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              T-shirts
            </button>
            <button className="flex-1 uppercase 2xl:px-[70px] xl:px-[50px] py-3 min-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Shirts
            </button>
            <button className="flex-1 uppercase 2xl:px-[70px] xl:px-[50px] py-3 min-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Hoodies
            </button>
            <button className="flex-1 uppercase 2xl:px-[70px] xl:px-[50px] py-3 min-w-fit text-[#8A8A8A] text-[13px] bg-[#FAFAFA] rounded-lg">
              Hoodies
            </button>
          </div>
          <Products
            filters={filters}
            load={true}
            sortOption={sortOption}
            query={query}
          />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
