import React from "react";
import { Link } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai";
import { GrGallery } from "react-icons/gr";
import { FaLockOpen } from "react-icons/fa6";

const Admin = () => {
  return (
    <div className="min py-[30px]">
      <div className=" container mx-auto flex-wrap flex gap-[20px] items-center justify-around text-white">
        <Link
          to={"/admin/products"}
          className="p-[50px] rounded-lg bg-purple-800 text-2xl flex items-center justify-center gap-[10px]"
        >
          <h1>Produit</h1>
          <AiFillProduct />
        </Link>

        <Link
          to={"/admin/gallery-settings"}
          className="p-[50px] rounded-lg bg-purple-800 text-2xl flex items-center justify-center gap-[10px]"
        >
          <h1>Galerie</h1>
          <GrGallery />
        </Link>
        <Link
          to={"/admin/status"}
          className="p-[50px] rounded-lg bg-purple-800 text-2xl flex items-center justify-center gap-[10px]"
        >
          <h1>statut du magasin</h1>
          <FaLockOpen />
        </Link>
      </div>
    </div>
  );
};

export default Admin;
