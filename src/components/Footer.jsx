import React from "react";
import logo from "../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";
import { MdFoodBank } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-zinc-900">
      <div className=" container p-[50px] flex-wrap gap-[20px] mx-auto text-white flex justify-around">
        <div className="flex flex-col gap-[10px] items-center">
          <h1 className="text-3xl text-yellow-500 font-bold">Contactez-nous</h1>
          <p>QF57+WMP, Unnamed Road, Boumerdes</p>
          <p>+213 65 88 99 77</p>
          <p>+213 65 88 99 77</p>
        </div>
        <div className="flex items-center flex-col gap-[10px]">
          <img src={logo} alt="logo-image" className="w-[150px] h-[150px]" />
          <p className="text-center">
            "La meilleure façon de se trouver est de se perdre au service des
            autres.”
          </p>
          <MdFoodBank className="text-4xl" />
          <div className="flex itmes-center gap-[10px]">
            <Link to={"https://www.instagram.com/pimpim_35/"} target="_blank">
              <FaInstagram className="text-3xl text-yellow-500 cursor-pointer" />
            </Link>
            <Link to={"https://www.facebook.com/pimpim.boum"} target="_blank">
              <FaFacebookSquare className="text-3xl text-yellow-500 cursor-pointer" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-[10px] items-center">
          <h1 className="text-3xl text-yellow-500 font-bold">
            Horaires de travail
          </h1>
          <p>
            Lundi-vendredi: <br /> 08:00 am -12:00 am
          </p>
          <p>
            Samedi-dimanche: <br /> 07:00am -11:00 pm
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
