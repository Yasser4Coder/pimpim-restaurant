import React, { useState, useEffect } from "react";
import galleryApi from "../../../api/galleryApi";

const TheGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await galleryApi.getAll();
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white text-xl">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-400 text-center">
          <p className="text-lg mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white text-center">
          <p className="text-xl mb-2">No images found</p>
          <p className="text-gray-300">Gallery is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Modern Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={image._id}
            className="break-inside-avoid mb-4 group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => openImage(image)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                src={image.url}
                alt={image.title || "Restaurant gallery image"}
                loading="lazy"
              />

              {/* Overlay with restaurant-themed styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {image.title && (
                    <h3 className="text-xl font-bold mb-2 text-yellow-400">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {image.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center text-yellow-400">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Click to view</span>
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeImage}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors duration-200 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image container */}
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.title || "Gallery image"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image info overlay */}
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  {selectedImage.title && (
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                      {selectedImage.title}
                    </h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-white text-lg leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(
                  (img) => img._id === selectedImage._id
                );
                const prevIndex =
                  currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                setSelectedImage(images[prevIndex]);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-200"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.findIndex(
                  (img) => img._id === selectedImage._id
                );
                const nextIndex =
                  currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                setSelectedImage(images[nextIndex]);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-200"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheGallery;
