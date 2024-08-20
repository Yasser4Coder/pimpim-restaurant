import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";

const TheGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("img/images");
        setImages(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images &&
        images.map((image) => (
          <div>
            <img
              class="h-auto max-w-full rounded-lg"
              src={image.imageUrl}
              alt=""
            />
          </div>
        ))}
    </div>
  );
};

export default TheGallery;
