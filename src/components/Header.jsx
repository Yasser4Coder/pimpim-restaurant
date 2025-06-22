import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { MdRestaurant } from "react-icons/md";
import { MdRestaurantMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import settingsApi from "../api/settingsApi";
import img from "../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";

const Header = () => {
  const [toogle, setToggle] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: "PimPim",
    logo: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const count = useSelector((state) => state.cart);

  // Fetch restaurant settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.get();
        setRestaurantSettings({
          name: response.data.name || "PimPim",
          logo: response.data.logo || "",
        });
      } catch (error) {
        console.error("Failed to fetch restaurant settings:", error);
        // Keep default values if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleClick = () => {
    setToggle(!toogle);
  };
  let totalCount = 0;
  count.forEach((element) => {
    totalCount = totalCount + element.count;
  });
  const cart = {
    totalecount: totalCount,
  };

  return (
    <header className="pt-[20px] pb-[20px] bg-zinc-900">
      <div className="flex text-white mx-auto bg-zinc-900 container text-lg items-center justify-between">
        <div className="logo flex items-center gap-[10px]">
          {isLoading ? (
            // Loading state
            <div className="w-[60px] h-[60px] bg-gray-600 rounded-full animate-pulse"></div>
          ) : restaurantSettings.logo ? (
            // Custom logo from settings
            <img
              width={60}
              height={60}
              src={restaurantSettings.logo}
              alt={`${restaurantSettings.name} logo`}
              className="rounded-full object-cover"
            />
          ) : (
            // Default logo
            <img
              width={60}
              height={60}
              src={img}
              alt="logo"
              className="rounded-full object-cover"
            />
          )}
          <Link className="text-xl font-bold" to="/">
            {isLoading ? "Loading..." : restaurantSettings.name}
          </Link>
        </div>
        <div className="links hidden lg:flex items-center gap-[20px]">
          <Link to="/">Principale</Link>
          <Link to="/aboutus">A propre de nous</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/gallery">Galerie</Link>
          <Link to="/track">Suivre Commande</Link>
        </div>
        <div className="login-menu hidden lg:flex items-center gap-[20px]">
          <Link to="/cart" className="cart relative">
            <FaCartShopping className="text-3xl cursor-pointer" />
            {cart.totalecount !== 0 ? (
              <div className="absolute top-[-10px] right-[-5px] bg-yellow-500 p-[3px] rounded-full">
                <p className="text-sm text-black">{cart.totalecount}</p>
              </div>
            ) : (
              ""
            )}
          </Link>
          <Link to="/login" className="flex items-center justify-center">
            <FaUser className="text-2xl cursor-pointer" title="Login" />
          </Link>
        </div>
        <div onClick={handleClick} className="MobileNav lg:hidden">
          <MdRestaurant className="text-3xl cursor-pointer" />
        </div>
        {toogle && (
          <div className=" fixed z-30 top-0 left-0 bg-zinc-900 w-screen p-[30px] h-screen">
            <MdRestaurantMenu
              onClick={handleClick}
              className=" text-3xl cursor-pointer absolute right-[20px]"
            />
            <div className="flex flex-col items-center justify-center gap-[20px]">
              <Link onClick={handleClick} to="/">
                Principale
              </Link>
              <Link onClick={handleClick} to="/aboutus">
                A propre de nous
              </Link>
              <Link onClick={handleClick} to="/menu">
                Menu
              </Link>
              <Link onClick={handleClick} to="/gallery">
                Galerie
              </Link>
              <Link onClick={handleClick} to="/track">
                Suivre Commande
              </Link>
              <Link to="/cart" onClick={handleClick} className=" relative">
                <FaCartShopping className="text-3xl" />
                {cart.totalecount !== 0 ? (
                  <div className="absolute top-[-10px] right-[-5px] bg-yellow-500 p-[3px] rounded-full">
                    <p className="text-sm text-black">{cart.totalecount}</p>
                  </div>
                ) : (
                  ""
                )}
              </Link>
              <Link
                onClick={handleClick}
                to="/login"
                className="flex items-center justify-center"
              >
                <FaUser className="text-2xl" title="Login" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
