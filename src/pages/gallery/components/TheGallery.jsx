import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";

import { IoMdClose } from "react-icons/io";

const TheGallery = () => {
  const [images, setImages] = useState([""]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchImages = async () => {
      try {
        const response = await axios.get("img/images");
        setImages(response.data);
        setLoading(false);
        console.log();
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, []);

  const [model, setModel] = useState(false);
  const [tempimgSrc, setTempImgSrc] = useState("");
  const getImg = (imgSrc) => {
    setTempImgSrc(imgSrc);
    setModel(true);
  };
  return (
    <>
      <div className={model ? "model open" : "model"}>
        <img src={tempimgSrc} className="image" alt="" />
        <IoMdClose
          onClick={() => setModel(false)}
          className=" fixed top-[10px] right-[10px] w-[2rem] h-[2rem] p-[5px] text-white cursor-pointer"
        />
      </div>
      <div className="gallery">
        {loading === true ? (
          <div className="w-[20px] h-[200px]">
            <div class="loader"></div>
          </div>
        ) : (
          images &&
          images.map((item) => {
            return (
              <div
                className="pics"
                key={item._id}
                onClick={() => getImg(item.imageUrl)}
              >
                <img src={item.imageUrl} style={{ width: "100%" }} alt="" />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default TheGallery;
