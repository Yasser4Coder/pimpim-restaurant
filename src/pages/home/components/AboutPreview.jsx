import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaUtensils,
  FaUsers,
  FaAward,
  FaLeaf,
  FaClock,
} from "react-icons/fa";
import { MdRestaurant, MdLocalDining } from "react-icons/md";
import settingsApi from "../../../api/settingsApi";

const AboutPreview = () => {
  const [aboutSettings, setAboutSettings] = useState({
    name: "PimPim",
    description: "Où la Gastronomie Rencontre la Passion",
    story:
      "La meilleure façon de se trouver est de se perdre au service des autres.",
    owner: {
      name: "Chef Ahmed",
      title: "Chef Principal",
      bio: "Passionné de cuisine depuis plus de 15 ans, notre chef principal crée des plats uniques qui racontent une histoire.",
      photo: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch about settings
  useEffect(() => {
    const fetchAboutSettings = async () => {
      try {
        const response = await settingsApi.get();
        const settings = response.data;

        setAboutSettings({
          name: settings.name || "PimPim",
          description:
            settings.description || "Où la Gastronomie Rencontre la Passion",
          story:
            settings.story ||
            "La meilleure façon de se trouver est de se perdre au service des autres.",
          owner: settings.owner || {
            name: "Chef Ahmed",
            title: "Chef Principal",
            bio: "Passionné de cuisine depuis plus de 15 ans, notre chef principal crée des plats uniques qui racontent une histoire.",
            photo: "",
          },
        });
      } catch (error) {
        console.error("Failed to fetch about settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutSettings();
  }, []);

  const values = [
    {
      icon: FaHeart,
      title: "Passion",
      description: "Chaque plat est préparé avec amour et dévotion",
    },
    {
      icon: FaLeaf,
      title: "Qualité",
      description: "Ingrédients frais et de première qualité",
    },
    {
      icon: FaUsers,
      title: "Famille",
      description: "Un environnement chaleureux et accueillant",
    },
    {
      icon: FaAward,
      title: "Excellence",
      description: "Excellence culinaire dans chaque détail",
    },
  ];

  return (
    <div className="min py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Section */}
            <div className="order-2 lg:order-1">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
                  <MdRestaurant className="mr-2" />
                  Notre Histoire
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Découvrez Notre Passion
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-600/50 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    aboutSettings.description
                  )}
                </p>
              </div>

              {/* Story */}
              <div className="mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaUtensils className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Notre Philosophie
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {isLoading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-600/50 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-600/50 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-600/50 rounded animate-pulse w-2/3"></div>
                          </div>
                        ) : (
                          aboutSettings.story
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Nos Valeurs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <value.icon className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {value.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/aboutus"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <MdLocalDining className="mr-2" />
                  En Savoir Plus
                </Link>
                <Link
                  to="/menu"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <FaUtensils className="mr-2" />
                  Voir le Menu
                </Link>
              </div>
            </div>

            {/* Image/Chef Section */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  {isLoading ? (
                    <div className="w-full h-[500px] bg-gray-600/50 rounded-3xl animate-pulse"></div>
                  ) : aboutSettings.owner.photo ? (
                    <img
                      src={aboutSettings.owner.photo}
                      alt={`${aboutSettings.owner.name} - ${aboutSettings.owner.title}`}
                      className="w-full h-[500px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-3xl flex items-center justify-center">
                      <div className="text-center">
                        <MdRestaurant className="text-6xl text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {aboutSettings.owner.name}
                        </h3>
                        <p className="text-gray-300">
                          {aboutSettings.owner.title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Chef Info Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                      <FaAward className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">
                        {isLoading ? (
                          <div className="h-5 bg-gray-600/50 rounded animate-pulse w-32"></div>
                        ) : (
                          aboutSettings.owner.name
                        )}
                      </h4>
                      <p className="text-yellow-400 font-medium">
                        {isLoading ? (
                          <div className="h-4 bg-gray-600/50 rounded animate-pulse w-24"></div>
                        ) : (
                          aboutSettings.owner.title
                        )}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        {isLoading ? (
                          <div className="h-3 bg-gray-600/50 rounded animate-pulse w-40"></div>
                        ) : (
                          aboutSettings.owner.bio
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-500 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPreview;
