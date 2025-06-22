import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaExternalLinkAlt,
  FaDirections,
  FaGlobe,
} from "react-icons/fa";
import settingsApi from "../../../api/settingsApi";

const Location = () => {
  const [locationSettings, setLocationSettings] = useState({
    contact: {
      address: "QF57+WMP, Unnamed Road, Boumerdes",
      phone: "+1 (555) 123-4567",
      email: "info@deliciousbites.com",
      website: "www.deliciousbites.com",
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
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch location settings
  useEffect(() => {
    const fetchLocationSettings = async () => {
      try {
        const response = await settingsApi.get();
        const settings = response.data;

        setLocationSettings({
          contact: settings.contact || {
            address: "QF57+WMP, Unnamed Road, Boumerdes",
            phone: "+1 (555) 123-4567",
            email: "info@deliciousbites.com",
            website: "www.deliciousbites.com",
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
        });
      } catch (error) {
        console.error("Failed to fetch location settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationSettings();
  }, []);

  // Helper function to format operating hours
  const formatHours = (hours) => {
    const days = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    };

    const formatTime = (time) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return Object.entries(hours).map(([day, schedule]) => {
      if (schedule.closed) {
        return { day: days[day], hours: "Fermé", isClosed: true };
      }
      return {
        day: days[day],
        hours: `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`,
        isClosed: false,
      };
    });
  };

  const ContactCard = ({
    icon: Icon,
    title,
    content,
    link,
    linkType = "external",
  }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 group">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="text-white text-sm md:text-lg" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">
            {title}
          </h3>
          {isLoading ? (
            <div className="h-3 md:h-4 bg-gray-600/50 rounded animate-pulse w-24 md:w-32"></div>
          ) : link ? (
            <a
              href={link}
              target={linkType === "external" ? "_blank" : "_self"}
              rel={linkType === "external" ? "noopener noreferrer" : ""}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 flex items-center group/link text-sm md:text-base"
            >
              <span className="truncate">{content}</span>
              <FaExternalLinkAlt className="ml-2 text-xs md:text-sm opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
            </a>
          ) : (
            <p className="text-gray-300 text-sm md:text-base">{content}</p>
          )}
        </div>
      </div>
    </div>
  );

  const HoursCard = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
      <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center">
          <FaClock className="text-white text-sm md:text-lg" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-white">
            Horaires d'ouverture
          </h3>
          <p className="text-gray-400 text-xs md:text-sm">
            Venez nous rendre visite
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 md:space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 md:h-4 bg-gray-600/50 rounded animate-pulse w-16 md:w-20"></div>
              <div className="h-3 md:h-4 bg-gray-600/50 rounded animate-pulse w-20 md:w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {formatHours(locationSettings.hours).map((schedule, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-1 md:py-2 border-b border-white/10 last:border-b-0"
            >
              <span className="text-white font-medium text-sm md:text-base">
                {schedule.day}
              </span>
              <span
                className={`font-semibold text-xs md:text-sm ${
                  schedule.isClosed ? "text-red-400" : "text-yellow-400"
                }`}
              >
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs md:text-sm font-medium mb-3 md:mb-4">
              <FaMapMarkerAlt className="mr-2" />
              Notre Localisation
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4">
              Trouvez-nous
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Venez nous rendre visite et découvrez notre cuisine exceptionnelle
              dans un cadre chaleureux
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
            {/* Map Section */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.4475320870574!2d3.4667642243567607!3d36.75982997225861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e693d0f797ef7%3A0x5994702123325167!2sPimpim!5e0!3m2!1sar!2sdz!4v1723757837073!5m2!1sar!2sdz"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map Location"
                  className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Decorative Elements - Hidden on mobile */}
              <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-500 rounded-full opacity-60"></div>
              <div className="hidden md:block absolute top-1/2 -left-2 w-4 h-4 bg-yellow-500 rounded-full opacity-40"></div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              {/* Contact Cards */}
              <div className="space-y-4 md:space-y-6">
                <ContactCard
                  icon={FaMapMarkerAlt}
                  title="Adresse"
                  content={locationSettings.contact.address}
                  link="https://www.google.com/maps/place/Pimpim/@36.75983,3.4667642,17z/data=!4m14!1m7!3m6!1s0x128e693d0f797ef7:0x5994702123325167!2sPimpim!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr!3m5!1s0x128e693d0f797ef7:0x5994702123325167!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr?entry=ttu"
                />

                {locationSettings.contact.phone && (
                  <ContactCard
                    icon={FaPhone}
                    title="Téléphone"
                    content={locationSettings.contact.phone}
                    link={`tel:${locationSettings.contact.phone}`}
                    linkType="phone"
                  />
                )}

                {locationSettings.contact.email && (
                  <ContactCard
                    icon={FaEnvelope}
                    title="Email"
                    content={locationSettings.contact.email}
                    link={`mailto:${locationSettings.contact.email}`}
                    linkType="email"
                  />
                )}

                {locationSettings.contact.website && (
                  <ContactCard
                    icon={FaGlobe}
                    title="Site Web"
                    content={locationSettings.contact.website}
                    link={`https://${locationSettings.contact.website}`}
                  />
                )}
              </div>

              {/* Operating Hours */}
              <HoursCard />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <Link
                  target="_blank"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group text-sm md:text-base"
                  to="https://www.google.com/maps/place/Pimpim/@36.75983,3.4667642,17z/data=!4m14!1m7!3m6!1s0x128e693d0f797ef7:0x5994702123325167!2sPimpim!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr!3m5!1s0x128e693d0f797ef7:0x5994702123325167!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr?entry=ttu"
                >
                  <FaDirections className="mr-2 md:mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Obtenir l'Itinéraire</span>
                  <span className="sm:hidden">Itinéraire</span>
                </Link>

                <Link
                  target="_blank"
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group text-sm md:text-base"
                  to="https://www.google.com/maps/place/Pimpim/@36.75983,3.4667642,17z/data=!4m14!1m7!3m6!1s0x128e693d0f797ef7:0x5994702123325167!2sPimpim!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr!3m5!1s0x128e693d0f797ef7:0x5994702123325167!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr?entry=ttu"
                >
                  <FaExternalLinkAlt className="mr-2 md:mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="hidden sm:inline">Voir sur Google Maps</span>
                  <span className="sm:hidden">Google Maps</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
