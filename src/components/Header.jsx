import img from "../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { MdRestaurant } from "react-icons/md";
import { useState } from "react";
import { MdRestaurantMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  const [toogle, setToggle] = useState(false);
  const count = useSelector((state) => state.cart);
  const { orgRole } = useAuth();

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
          <img width={60} height={60} src={img} alt="logo" />
          <Link className="text-xl font-bold" to="/">
            PimPim
          </Link>
        </div>
        <div className="links hidden lg:flex items-center gap-[20px]">
          <Link to="/">Principale</Link>
          <Link to="/aboutus">A propre de nous</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/gallery">Galerie</Link>
          {orgRole === "org:admin" ? <Link to="/admin">admin</Link> : ""}
        </div>
        <div className="login-menu hidden lg:flex items-center gap-[20px]">
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div className="w-[1px] h-[25px] bg-slate-200"></div>
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
              {orgRole === "org:admin" ? (
                <Link onClick={handleClick} to="/admin">
                  admin
                </Link>
              ) : (
                ""
              )}
              <div>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>

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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
