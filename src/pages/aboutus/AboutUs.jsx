import React, { useState, useEffect } from "react";
import img from "../../images/pimpim-cover.png";
import settingsApi from "../../api/settingsApi";

const AboutUs = () => {
  const [settings, setSettings] = useState({
    name: "PimPim",
    description: "Où la Gastronomie Rencontre la Passion",
    story:
      "La meilleure façon de se trouver est de se perdre au service des autres.",
    owner: {
      name: "Chef Ahmed",
      title: "Chef Principal",
      bio: "Notre chef passionné avec plus de 15 ans d'expérience dans l'art culinaire, dédié à créer des expériences gastronomiques exceptionnelles pour nos clients.",
    },
    coverImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.get();
        const data = response.data;

        setSettings({
          name: data.name || "PimPim",
          description:
            data.description || "Où la Gastronomie Rencontre la Passion",
          story:
            data.story ||
            "La meilleure façon de se trouver est de se perdre au service des autres.",
          owner: data.owner || {
            name: "Chef Ahmed",
            title: "Chef Principal",
            bio: "Notre chef passionné avec plus de 15 ans d'expérience dans l'art culinaire, dédié à créer des expériences gastronomiques exceptionnelles pour nos clients.",
          },
          coverImage: data.coverImage || "",
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min">
      <section className="text-white body-font">
        <div className="container px-5 py-24 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="rounded-lg h-64 overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-gray-600/50 animate-pulse"></div>
              ) : settings.coverImage ? (
                <img
                  alt="Restaurant Cover"
                  className="object-cover object-center h-full w-full"
                  src={settings.coverImage}
                />
              ) : (
                <img
                  alt="content"
                  className="object-cover object-center h-full w-full"
                  src={img}
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-yellow-500 text-lg">
                    Le Patron
                  </h2>
                  <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600/50 rounded animate-pulse w-32"></div>
                      <div className="h-4 bg-gray-600/50 rounded animate-pulse w-24"></div>
                    </div>
                  ) : (
                    <p className="text-base">{settings.owner.bio}</p>
                  )}
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-600/50 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-600/50 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-600/50 rounded animate-pulse w-3/4"></div>
                    <div className="h-6 bg-gray-600/50 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-600/50 rounded animate-pulse w-5/6"></div>
                  </div>
                ) : (
                  <>
                    <p className="leading-relaxed text-lg mb-4">
                      Bienvenue chez {settings.name} Restaurant, un
                      établissement gastronomique d'exception situé au cœur de
                      Boumerdes. Depuis notre ouverture, nous nous efforçons de
                      offrir une expérience culinaire unique qui allie tradition
                      et modernité.
                    </p>
                    <p className="leading-relaxed text-lg mb-4">
                      Notre équipe passionnée de chefs talentueux travaille avec
                      des ingrédients frais et de qualité pour créer des plats
                      authentiques qui racontent une histoire. Chaque plat est
                      préparé avec amour et attention aux détails, reflétant
                      notre engagement envers l'excellence culinaire.
                    </p>
                    <p className="leading-relaxed text-lg">
                      Chez {settings.name}, nous croyons que la nourriture est
                      plus qu'un simple repas - c'est une expérience qui
                      rassemble les gens, crée des souvenirs et nourrit l'âme.
                      Nous vous invitons à découvrir notre passion pour la
                      gastronomie et à partager avec nous des moments
                      inoubliables autour de nos délicieuses créations.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
