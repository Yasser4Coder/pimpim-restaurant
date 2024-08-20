import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import classes from "./swiper2.module.css";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

import { Pagination } from "swiper/modules";
import img1 from "../../../images/gallery1.jpg";
import img2 from "../../../images/gallery2.jpg";
import img3 from "../../../images/gallery3.jpg";
import img4 from "../../../images/gallery4.jpg";
import img5 from "../../../images/gallery5.jpg";
import img6 from "../../../images/gallery6.jpg";

const PhotosGallery = () => {
  return (
    <div className=" bg-neutral-900 py-[50px] text-white">
      <div className="pl-[1rem] sm:pl-[2rem] lg:pl-[4rem] xl:pl-[5rem] 2xl:pl-[6rem] flex flex-col sm:flex-row items-center gap-[30px]">
        <div className="content flex flex-col gap-[20px]">
          <p className="text-yellow-500">Instagram</p>
          <h1 className="text-4xl font-bold">Galerie de photos</h1>
          <p className="text-base md:text-lg">
            Découvrez notre univers culinaire sur Instagram, avec des photos de
            nos plats savoureux et authentiques. Chaque image reflète notre
            passion et notre savoir-faire.
          </p>
          <div className="flex justify-center xl:justify-start">
            <Link
              className="py-2 px-4 bg-yellow-500 font-bold text-black text-base md:text-lg text-center rounded-lg"
              to="/gallery"
            >
              Voir plus
            </Link>
          </div>
        </div>
        <div className="gallery flex max-w-[65%] h-[320px]">
          <Swiper
            className={classes.swiper}
            slidesPerView={1}
            breakpoints={{
              200: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
          >
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img1} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img2} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img3} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img4} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img5} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
            <SwiperSlide className={classes.swiperslide}>
              <img className={classes.swiperslideimg} src={img6} alt="" />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon icon={faInstagram} className={classes.icon} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PhotosGallery;
