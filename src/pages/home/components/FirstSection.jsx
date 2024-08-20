import React from "react";
import { Link } from "react-router-dom";
import img from "../../../images/Snapinsta.app_448116302_7576420729111064_2506789993271330359_n_1024.jpg";
import img1 from "../../../images/Snapinsta.app_447767950_25643712418609308_4327164228410308211_n_1024.jpg";
import img2 from "../../../images/Snapinsta.app_446100709_1256735475295272_3575094005448019352_n_1024.jpg";
import { SiAkamai } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import classes from "./swiper1.module.css";

const FirstSection = () => {
  return (
    <div className="min min-h-screen">
      <div className=" container mx-auto min-h-screen flex items-center py-10">
        <div className="container mx-auto flex flex-col-reverse xl:flex-row items-center justify-between w-full px-4 xl:px-0 text-white">
          <div className="content flex flex-col gap-8 mt-8 xl:mt-0 text-center xl:text-left">
            <h1 className="text-3xl md:text-4xl xl:text-[60px] xl:leading-[60px] font-bold">
              Découvrez l'Art <br /> de la Gastronomie
            </h1>
            <p className="text-base md:text-lg">
              Bienvenue chez PimPim Restaurant, <br /> Où la Gastronomie
              Rencontre la Passion
            </p>
            <div className="flex justify-center xl:justify-start">
              <Link
                className="py-2 px-4 bg-yellow-500 font-bold text-black text-base md:text-lg text-center rounded-lg"
                to="/menu"
              >
                Notre Menu
              </Link>
            </div>
            <div className="relative w-[70px] p-[5px] h-[70px] border-[2px] pimpim_border rounded-full flex items-center justify-center mx-auto xl:mx-0">
              <SiAkamai className="absolute text-[90px] rotate-180 top-0 left-0 pimpim" />
              <div className="border-[2px] w-[50px] h-[50px] flex items-center justify-center text-lg font-bold pimpim_border rounded-full">
                P
              </div>
            </div>
          </div>
          <div className="image relative bg-slate-500 w-full max-w-[563px] mx-auto xl:mx-0 mt-10 xl:mt-0">
            <Swiper
              className={classes.swiper}
              style={{
                "--swiper-pagination-color": "#FFBA08",
                "--swiper-pagination-bullet-inactive-color": "#999999",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "16px",
                "--swiper-pagination-bullet-horizontal-gap": "6px",
              }}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
            >
              <SwiperSlide className={classes.swiperslide}>
                <img
                  src={img}
                  alt="home_image"
                  className={classes.swiperslideimg}
                />
              </SwiperSlide>
              <SwiperSlide className={classes.swiperslide}>
                <img
                  src={img1}
                  alt="home_image"
                  className={classes.swiperslideimg}
                />
              </SwiperSlide>
              <SwiperSlide className={classes.swiperslide}>
                <img
                  src={img2}
                  alt="home_image"
                  className={classes.swiperslideimg}
                />
              </SwiperSlide>
            </Swiper>
            <SiAkamai className="absolute top-[-49px] pimpim left-[-68px] text-[120px] hidden xl:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstSection;
