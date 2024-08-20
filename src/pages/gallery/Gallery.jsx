import React from "react";
import TheGallery from "./components/TheGallery";

const Gallery = () => {
  return (
    <div className="min py-[80px]">
      <div className="container mx-auto flex flex-col items-center gap-[40px]">
        <h1 className="text-4xl font-bold text-yellow-500">Galerie</h1>
        <TheGallery />
      </div>
    </div>
  );
};

export default Gallery;
