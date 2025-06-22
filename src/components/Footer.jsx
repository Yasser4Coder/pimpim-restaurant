import React, { useState, useEffect } from "react";
import logo from "../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";
import { MdFoodBank } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import settingsApi from "../api/settingsApi";

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState({
    name: "PimPim",
    logo: "",
    contact: {
      address: "QF57+WMP, Unnamed Road, Boumerdes",
      phone: "+213 65 88 99 77",
      email: "info@deliciousbites.com",
    },
    hours: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "22:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "10:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },
    story:
      "La meilleure façon de se trouver est de se perdre au service des autres.",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch footer settings
  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const response = await settingsApi.get();
        const settings = response.data;

        setFooterSettings({
          name: settings.name || "PimPim",
          logo: settings.logo || "",
          contact: settings.contact || {
            address: "QF57+WMP, Unnamed Road, Boumerdes",
            phone: "+213 65 88 99 77",
            email: "info@deliciousbites.com",
          },
          hours: settings.hours || {
            monday: { open: "11:00", close: "22:00", closed: false },
            tuesday: { open: "11:00", close: "22:00", closed: false },
            wednesday: { open: "11:00", close: "22:00", closed: false },
            thursday: { open: "11:00", close: "22:00", closed: false },
            friday: { open: "11:00", close: "23:00", closed: false },
            saturday: { open: "10:00", close: "23:00", closed: false },
            sunday: { open: "10:00", close: "21:00", closed: false },
          },
          story:
            settings.story ||
            "La meilleure façon de se trouver est de se perdre au service des autres.",
        });
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterSettings();
  }, []);

  // Helper function to format operating hours for footer
  const formatFooterHours = (hours) => {
    // Simple format - just show weekdays and weekends
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const weekends = ["saturday", "sunday"];

    const weekdayHours = weekdays.map((day) => hours[day]);
    const weekendHours = weekends.map((day) => hours[day]);

    // Get first weekday and weekend hours
    const weekday = weekdayHours[0];
    const weekend = weekendHours[0];

    return {
      weekdays: weekday,
      weekends: weekend,
    };
  };

  const footerHours = formatFooterHours(footerSettings.hours);

  return (
    <div className="bg-zinc-900">
      <div className="container p-[50px] flex-wrap gap-[20px] mx-auto text-white flex justify-around">
        {/* Contact Section */}
        <div className="flex flex-col gap-[10px] items-center">
          <h1 className="text-3xl text-yellow-500 font-bold">Contactez-nous</h1>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-600 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-600 rounded animate-pulse w-32"></div>
            </div>
          ) : (
            <>
              <p>{footerSettings.contact.address}</p>
              <p>{footerSettings.contact.phone}</p>
              {footerSettings.contact.email && (
                <p>{footerSettings.contact.email}</p>
              )}
            </>
          )}
        </div>

        {/* Logo & Story Section */}
        <div className="flex items-center flex-col gap-[10px]">
          {isLoading ? (
            <div className="w-[150px] h-[150px] bg-gray-600 rounded-full animate-pulse"></div>
          ) : footerSettings.logo ? (
            <img
              src={footerSettings.logo}
              alt={`${footerSettings.name} logo`}
              className="w-[150px] h-[150px] rounded-full object-cover"
            />
          ) : (
            <img src={logo} alt="logo-image" className="w-[150px] h-[150px]" />
          )}

          <p className="text-center max-w-xs">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              footerSettings.story
            )}
          </p>

          <MdFoodBank className="text-4xl" />

          <div className="flex items-center gap-[10px]">
            <Link to={"https://www.instagram.com/pimpim_35/"} target="_blank">
              <FaInstagram className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-400 transition-colors" />
            </Link>
            <Link to={"https://www.facebook.com/pimpim.boum"} target="_blank">
              <FaFacebookSquare className="text-3xl text-yellow-500 cursor-pointer hover:text-yellow-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="flex flex-col gap-[10px] items-center">
          <h1 className="text-3xl text-yellow-500 font-bold">
            Horaires de travail
          </h1>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded animate-pulse w-40"></div>
              <div className="h-4 bg-gray-600 rounded animate-pulse w-36"></div>
            </div>
          ) : (
            <>
              <p>
                Lundi-vendredi: <br />
                {footerHours.weekdays?.closed
                  ? "Fermé"
                  : `${footerHours.weekdays?.open} - ${footerHours.weekdays?.close}`}
              </p>
              <p>
                Samedi-dimanche: <br />
                {footerHours.weekends?.closed
                  ? "Fermé"
                  : `${footerHours.weekends?.open} - ${footerHours.weekends?.close}`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
