import React from "react";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Client Fidèle",
      rating: 5,
      text: "Excellente cuisine ! Les plats sont délicieux et le service est impeccable. Je recommande vivement ce restaurant.",
      avatar: "AB",
    },
    {
      name: "Fatima Zohra",
      role: "Critique Culinaire",
      rating: 5,
      text: "Une expérience gastronomique exceptionnelle. Les ingrédients sont frais et la présentation est magnifique.",
      avatar: "FZ",
    },
    {
      name: "Karim Mansouri",
      role: "Entrepreneur",
      rating: 5,
      text: "Parfait pour les repas d'affaires. Ambiance professionnelle et cuisine de qualité. Très satisfait !",
      avatar: "KM",
    },
    {
      name: "Amina Bouchareb",
      role: "Famille",
      rating: 5,
      text: "Restaurant familial par excellence. Nos enfants adorent et nous aussi ! Service rapide et personnel aimable.",
      avatar: "AB",
    },
    {
      name: "Youssef Hamidi",
      role: "Food Blogger",
      rating: 5,
      text: "Découverte culinaire incroyable ! Chaque plat raconte une histoire. Un must pour les amateurs de bonne cuisine.",
      avatar: "YH",
    },
    {
      name: "Leila Cherif",
      role: "Cliente Régulière",
      rating: 5,
      text: "Je viens ici depuis des années et la qualité ne cesse de s'améliorer. Un vrai coup de cœur !",
      avatar: "LC",
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="min py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
              <FaStar className="mr-2" />
              Avis Clients
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits qui font
              confiance à notre cuisine
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              modules={[Pagination, Autoplay]}
              className="testimonials-swiper"
              style={{
                "--swiper-pagination-color": "#FFBA08",
                "--swiper-pagination-bullet-inactive-color": "#999999",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "12px",
                "--swiper-pagination-bullet-horizontal-gap": "6px",
              }}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 h-full">
                    <div className="flex flex-col h-full">
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <FaQuoteLeft className="text-yellow-400 text-lg" />
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center mb-4">
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <div className="flex-1 mb-6">
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed text-center italic">
                          "{testimonial.text}"
                        </p>
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div className="text-center">
                          <h4 className="text-white font-semibold text-sm md:text-base">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-xs md:text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                500+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Clients Satisfaits
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                4.9
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Note Moyenne
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                50+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Plats Uniques
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                5
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Années d'Expérience
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
