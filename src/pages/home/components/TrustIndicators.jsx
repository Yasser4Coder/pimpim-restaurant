import React from "react";
import {
  FaShieldAlt,
  FaCertificate,
  FaAward,
  FaClock,
  FaLeaf,
  FaUsers,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import { MdRestaurant, MdLocalDining } from "react-icons/md";

const TrustIndicators = () => {
  const indicators = [
    {
      icon: FaShieldAlt,
      title: "Sécurité Garantie",
      description:
        "Normes d'hygiène strictes et sécurité alimentaire certifiée",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FaCertificate,
      title: "Certification Qualité",
      description: "Certifiés par les autorités sanitaires locales",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FaAward,
      title: "Excellence Reconnue",
      description: "Récompensé pour notre excellence culinaire",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: FaClock,
      title: "Service Rapide",
      description: "Préparation et livraison dans les délais promis",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FaLeaf,
      title: "Ingrédients Frais",
      description: "Produits frais et de saison quotidiennement",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: FaUsers,
      title: "Équipe Expérimentée",
      description: "Chefs qualifiés avec plus de 15 ans d'expérience",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const stats = [
    { number: "500+", label: "Clients Satisfaits", icon: FaHeart },
    { number: "4.9", label: "Note Moyenne", icon: FaStar },
    { number: "50+", label: "Plats Uniques", icon: MdLocalDining },
    { number: "5", label: "Années d'Expérience", icon: MdRestaurant },
  ];

  return (
    <div className="min py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
              <FaShieldAlt className="mr-2" />
              Votre Confiance
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pourquoi Nous Faire Confiance
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Nous nous engageons à maintenir les plus hauts standards de
              qualité et de service
            </p>
          </div>

          {/* Trust Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${indicator.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <indicator.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {indicator.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {indicator.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Nos Chiffres Parlent d'Eux-Mêmes
              </h3>
              <p className="text-gray-300 text-lg">
                Une preuve concrète de notre engagement envers l'excellence
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="text-white text-2xl" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 md:mt-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Prêt à Nous Faire Confiance ?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Rejoignez nos centaines de clients satisfaits et découvrez
                pourquoi nous sommes le choix numéro 1
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/menu"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Commander Maintenant
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

export default TrustIndicators;
