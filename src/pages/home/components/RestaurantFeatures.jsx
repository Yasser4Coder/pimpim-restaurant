import React from "react";
import {
  FaUtensils,
  FaLeaf,
  FaClock,
  FaTruck,
  FaStar,
  FaUsers,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { MdRestaurant, MdLocalDining } from "react-icons/md";

const RestaurantFeatures = () => {
  const features = [
    {
      icon: FaUtensils,
      title: "Cuisine Fraîche",
      description:
        "Tous nos plats sont préparés avec des ingrédients frais et de qualité premium",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FaLeaf,
      title: "Ingrédients Bio",
      description:
        "Nous privilégions les produits locaux et biologiques pour une cuisine saine",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: FaClock,
      title: "Service Rapide",
      description:
        "Préparation rapide et service efficace pour satisfaire vos attentes",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FaTruck,
      title: "Livraison à Domicile",
      description: "Livraison rapide et sécurisée directement chez vous",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FaStar,
      title: "Qualité Premium",
      description: "Excellence culinaire garantie par nos chefs expérimentés",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: FaUsers,
      title: "Ambiance Familiale",
      description: "Un cadre chaleureux et accueillant pour tous les moments",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: FaHeart,
      title: "Passion Culinaire",
      description:
        "Chaque plat est préparé avec amour et passion pour la gastronomie",
      color: "from-red-500 to-red-600",
    },
    {
      icon: FaShieldAlt,
      title: "Hygiène Garantie",
      description: "Normes d'hygiène strictes pour votre sécurité et bien-être",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
              <MdRestaurant className="mr-2" />
              Pourquoi Nous Choisir
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              L'Excellence à Votre Service
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez ce qui fait de notre restaurant un lieu unique où chaque
              détail compte
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="text-white text-2xl" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 md:mt-16">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 md:p-8">
              <MdLocalDining className="text-4xl md:text-5xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Prêt à Découvrir Notre Cuisine ?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Venez déguster nos plats exceptionnels et vivre une expérience
                gastronomique inoubliable
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/menu"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Voir Notre Menu
                </a>
                <a
                  href="/aboutus"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  En Savoir Plus
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFeatures;
