import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import classes from "./swiper2.module.css";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Pagination, Autoplay } from "swiper/modules";
import settingsApi from "../../../api/settingsApi";
import img1 from "../../../images/gallery1.jpg";
import img2 from "../../../images/gallery2.jpg";
import img3 from "../../../images/gallery3.jpg";
import img4 from "../../../images/gallery4.jpg";
import img5 from "../../../images/gallery5.jpg";
import img6 from "../../../images/gallery6.jpg";

const PhotosGallery = () => {
  const [gallerySettings, setGallerySettings] = useState({
    title: "Galerie de photos",
    subtitle: "Instagram",
    description:
      "Découvrez notre univers culinaire sur Instagram, avec des photos de nos plats savoureux et authentiques. Chaque image reflète notre passion et notre savoir-faire.",
    images: [img1, img2, img3, img4, img5, img6], // Default images
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Instagram gallery settings
  useEffect(() => {
    const fetchGallerySettings = async () => {
      try {
        const response = await settingsApi.get();
        const settings = response.data;

        // Get selected gallery images
        const selectedImageIds =
          settings.landingPage?.instagramGallery?.selectedImages || [];

        if (selectedImageIds.length > 0) {
          // Fetch gallery images to get the actual image URLs
          const galleryResponse = await settingsApi.getGalleryImages();
          const allGalleryImages = galleryResponse.data;

          // Filter and map selected images
          const selectedImages = selectedImageIds
            .map((id) => allGalleryImages.find((img) => img._id === id))
            .filter((img) => img) // Remove any undefined images
            .map((img) => img.url);

          setGallerySettings({
            title:
              settings.landingPage?.instagramGallery?.title ||
              "Galerie de photos",
            subtitle:
              settings.landingPage?.instagramGallery?.subtitle || "Instagram",
            description:
              settings.landingPage?.instagramGallery?.description ||
              "Découvrez notre univers culinaire sur Instagram, avec des photos de nos plats savoureux et authentiques. Chaque image reflète notre passion et notre savoir-faire.",
            images:
              selectedImages.length > 0
                ? selectedImages
                : [img1, img2, img3, img4, img5, img6],
          });
        } else {
          // No selected images, use default content
          setGallerySettings({
            title:
              settings.landingPage?.instagramGallery?.title ||
              "Galerie de photos",
            subtitle:
              settings.landingPage?.instagramGallery?.subtitle || "Instagram",
            description:
              settings.landingPage?.instagramGallery?.description ||
              "Découvrez notre univers culinaire sur Instagram, avec des photos de nos plats savoureux et authentiques. Chaque image reflète notre passion et notre savoir-faire.",
            images: [img1, img2, img3, img4, img5, img6],
          });
        }
      } catch (error) {
        console.error("Failed to fetch gallery settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallerySettings();
  }, []);

  return (
    <div className="bg-neutral-900 py-[50px] text-white">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="content flex flex-col gap-6 w-full lg:w-1/2">
          <p className="text-yellow-500 text-lg font-medium">Instagram</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {isLoading ? (
              <div className="h-8 md:h-10 lg:h-12 bg-gray-600 rounded animate-pulse w-48 md:w-56 lg:w-64"></div>
            ) : (
              gallerySettings.title
            )}
          </h1>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-600 rounded animate-pulse w-4/5"></div>
              </div>
            ) : (
              gallerySettings.description
            )}
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              className="py-3 px-6 bg-yellow-500 font-bold text-black text-base md:text-lg text-center rounded-lg hover:bg-yellow-400 transition-colors duration-200"
              to="/gallery"
            >
              Voir plus
            </Link>
          </div>
        </div>
        <div className="gallery w-full lg:w-1/2 h-[280px] md:h-[320px] lg:h-[400px]">
          {isLoading ? (
            <div className="w-full h-full bg-gray-600 rounded-2xl animate-pulse"></div>
          ) : (
            <Swiper
              className={classes.swiper}
              slidesPerView={1}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 35,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              modules={[Pagination, Autoplay]}
              loop={gallerySettings.images.length > 1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {gallerySettings.images.map((image, index) => (
                <SwiperSlide key={index} className={classes.swiperslide}>
                  <img
                    className={classes.swiperslideimg}
                    src={image}
                    alt={`gallery_image_${index + 1}`}
                    onError={(e) => {
                      e.target.src = img1; // Fallback to default image
                      console.warn(`Failed to load image: ${image}`);
                    }}
                  />
                  <div className={classes.iconcontainer}>
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className={classes.icon}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosGallery;
