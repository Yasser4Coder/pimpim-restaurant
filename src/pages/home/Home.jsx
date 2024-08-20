import React from "react";
import FirstSection from "./components/FirstSection";
import PhotosGallery from "./components/PhotosGallery";
import Location from "./components/Location";

const Home = () => {
  return (
    <div>
      <FirstSection />
      <PhotosGallery />
      <Location />
    </div>
  );
};

export default Home;
