import React from "react";
import FirstSection from "./components/FirstSection";
import PhotosGallery from "./components/PhotosGallery";
import Location from "./components/Location";
import RestaurantFeatures from "./components/RestaurantFeatures";
import Testimonials from "./components/Testimonials";
import AboutPreview from "./components/AboutPreview";
import TrustIndicators from "./components/TrustIndicators";

const Home = () => {
  return (
    <div>
      <FirstSection />
      <RestaurantFeatures />
      <AboutPreview />
      <PhotosGallery />
      <Testimonials />
      <TrustIndicators />
      <Location />
    </div>
  );
};

export default Home;
