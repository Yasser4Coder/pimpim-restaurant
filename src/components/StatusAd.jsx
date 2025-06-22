import React, { useEffect, useState } from "react";
import settingsApi from "../api/settingsApi";

const StatusAd = () => {
  const [settings, setSettings] = useState({
    isOpen: true,
    name: "PimPim",
  });
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.get();
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed left-0 z-50 top-[20%] h-[20%] rounded-r-xl flex items-center">
        <div className="h-full w-[80%] bg-gray-400 flex items-center justify-center">
          <div className="rotate-90 font-semibold text-white">...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 z-50 top-[20%] h-[20%] rounded-r-xl flex items-center">
      <div
        onClick={() => setToggle(!toggle)}
        className={`h-full w-[80%] ${
          settings.isOpen ? "bg-green-500" : "bg-red-500"
        } flex items-center justify-center cursor-pointer transition-colors duration-300`}
      >
        <h1 className="rotate-90 font-semibold text-white">
          {settings.isOpen ? "Ouverte" : "Fermée"}
        </h1>
      </div>
      {toggle && (
        <div
          onClick={() => setToggle(!toggle)}
          className={`h-full w-full rounded-r-xl cursor-pointer py-[3px] px-[10px] flex text-center items-center justify-center text-white ${
            settings.isOpen ? "bg-green-500" : "bg-red-500"
          } transition-colors duration-300`}
        >
          <div className="text-sm">
            <p className="font-bold">{settings.name}</p>
            <p>
              {settings.isOpen ? "Nous sommes ouverts!" : "Nous sommes fermés"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusAd;
