import React, { useState, useEffect } from "react";
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
import settingsApi from "../../../api/settingsApi";

const FirstSection = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "Découvrez l'Art de la Gastronomie",
    subtitle: "Bienvenue chez PimPim Restaurant",
    description: "Où la Gastronomie Rencontre la Passion",
    images: [img, img1, img2], // Default images
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero section settings
  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await settingsApi.get();
        const settings = response.data;

        setHeroSettings({
          title: settings.landingPage?.heroSection?.title,
          subtitle:
            settings.landingPage?.heroSection?.subtitle ||
            "Bienvenue chez PimPim Restaurant",
          description:
            settings.landingPage?.heroSection?.description ||
            "Où la Gastronomie Rencontre la Passion",
          images:
            settings.landingPage?.heroSection?.images?.length > 0
              ? settings.landingPage.heroSection.images
              : [img, img1, img2], // Fallback to default images
        });
      } catch (error) {
        console.error("Failed to fetch hero settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSettings();
  }, []);

  return (
    <div className="min min-h-screen">
      <div className=" container mx-auto min-h-screen flex items-center py-10">
        <div className="container mx-auto flex flex-col-reverse xl:flex-row items-center justify-between w-full px-4 xl:px-0 text-white">
          <div className="content flex flex-col gap-8 mt-8 xl:mt-0 text-center xl:text-left">
            <h1 className="text-3xl md:text-4xl xl:text-[60px] xl:leading-[60px] font-bold">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 md:h-16 xl:h-[60px] bg-gray-600 rounded mb-2"></div>
                  <div className="h-12 md:h-16 xl:h-[60px] bg-gray-600 rounded"></div>
                </div>
              ) : (
                <>
                  {heroSettings.title.split("<br />").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        heroSettings.title.split("<br />").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </>
              )}
            </h1>
            <p className="text-base md:text-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 md:h-5 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 md:h-5 bg-gray-600 rounded"></div>
                </div>
              ) : (
                <>
                  {heroSettings.subtitle} <br /> {heroSettings.description}
                </>
              )}
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
          <div className="image relative w-full max-w-[563px] mx-auto xl:mx-0 mt-10 xl:mt-0">
            {isLoading ? (
              <div className="w-full h-[434px] bg-gray-600 rounded-2xl animate-pulse"></div>
            ) : (
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
                {heroSettings.images.map((image, index) => (
                  <SwiperSlide key={index} className={classes.swiperslide}>
                    <img
                      src={image}
                      alt={`hero_image_${index + 1}`}
                      className={classes.swiperslideimg}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <SiAkamai className="absolute top-[-49px] pimpim left-[-68px] text-[120px] hidden xl:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstSection;
