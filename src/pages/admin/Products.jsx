import React, { useState } from "react";
import ProductsTable from "./components/ProductsTable";
import { IoMdClose } from "react-icons/io";
import AddProductForm from "./components/AddProductForm";

const Products = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="min pb-[60px]">
      {toggle && (
        <div className=" fixed z-30 top-0 left-0 w-screen h-screen bg-slate-900">
          <div className="center1 w-full h-full px-[20px]">
            <AddProductForm />
          </div>
          <IoMdClose
            onClick={() => setToggle(false)}
            className=" cursor-pointer fixed top-[20px] right-[20px] text-4xl text-white"
          />
        </div>
      )}
      <div className=" container mx-auto flex flex-col">
        <div className="pt-[20px] flex items-center justify-around">
          <div
            onClick={() => setToggle(true)}
            className="cursor-pointer px-[20px] text-black py-[10px] bg-yellow-500 rounded-lg flex items-center justify-center w-[200px]"
          >
            <h1 className="font-semibold">Ajouter un produit</h1>
          </div>

          <h1 className="text-white text-center">
            Ce tableau montre tous les produits affichés sur la page du menu.
          </h1>
        </div>
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
