import React, { useState, useEffect } from "react";
import FileBase64 from "react-file-base64";
import axios from "../../api/axios";
import { FaTrash } from "react-icons/fa";

const GallerySet = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [requiredInfo, setRequiredInfo] = useState(false);

  const [images, setImages] = useState([""]);
  const [count, setCount] = useState(0);
  const [hoveredImageId, setHoveredImageId] = useState(null);

  const handleUpload = ({ base64, file }) => {
    const fileType = file.type;
    const fileSize = file.size;

    // Allowed file types
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxFileSize = 6 * 1024 * 1024; // 6MB in bytes

    // Check if the file type is valid
    if (!allowedTypes.includes(fileType)) {
      setErrorMessage(
        "Veuillez télécharger un fichier image valide (png, jpg, jpeg)"
      );
      return;
    }

    // Check if the file size is within the limit
    if (fileSize > maxFileSize) {
      setErrorMessage("La taille du fichier dépasse la limite de 6 Mo");
      return;
    }

    // Proceed with file handling if the file is valid and within size limits
    setErrorMessage(false); // Clear any previous errors
    setSelectedFile(base64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("imageUrl", selectedFile);

    await axios
      .post("img/images", formData)
      .then(() => {
        setLoading(false);
        setMessage(true);
        setCount(count + 1);
        setTimeout(() => {
          setMessage(false);
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        setRequiredInfo(true);
        setTimeout(() => {
          setRequiredInfo(false);
        }, 5000);
      });
  };

  useEffect(() => {
    setLoading2(true);
    const fetchImages = async () => {
      try {
        const response = await axios.get("img/images");
        setImages(response.data);
        setLoading2(false);
        console.log();
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [count]);

  const handleClick = async (id) => {
    const confirmDelete = window.confirm(
      "Etes-vous sûr de vouloir supprimer ce produit ?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`img/images/${id}`);
        alert("Produit supprimé avec succès !");
        setCount((prevCount) => prevCount + 1);
      } catch (err) {
        console.log(err);
        alert("Impossible de supprimer le produit. Veuillez réessayer.");
      }
    } else {
      alert("Suppression du produit annulée.");
    }
  };

  return (
    <div className="min py-[40px] text-white relative">
      {loading && (
        <div className="w-full h-full absolute top-0 left-0 z-50 bag flex items-center justify-center">
          <div class="loader"></div>
        </div>
      )}
      <div className=" container mx-auto flex flex-col gap-[20px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[20px] items-start sm:flex-row sm:items-center justify-between"
        >
          <div className="flex flex-col gap-[20px]">
            {message && (
              <p className="text-green-500">
                L'image a été ajoutée avec succès à la galerie !
              </p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {requiredInfo && (
              <p className="text-red-500">
                Certaines informations requises sont manquantes.
              </p>
            )}
            <h1>Télécharger l'image: </h1>
            <FileBase64
              type="file"
              id="image"
              name="image"
              multiple={false}
              onDone={handleUpload}
              handleUpload
              className="hidden"
            />
            {selectedFile && (
              <img
                src={selectedFile}
                className="w-[150px] border-[1px] border-yellow-500 h-[150px] object-cover"
                alt="image-selcted"
              />
            )}
          </div>
          <button
            type="submit"
            className=" px-[30px] py-[15px] bg-blue-500 rounded-xl"
          >
            Sauvegarder
          </button>
        </form>

        <div>
          <h1 className="text-2xl pb-[20px]">
            Toutes les images sur la Galerie:
          </h1>
          <div className="flex gap-[15px] flex-wrap">
            {loading2 === true ? (
              <div className="w-[20px] h-[200px]">
                <div class="loader"></div>
              </div>
            ) : (
              images &&
              images.map((image) => (
                <div
                  onMouseEnter={() => setHoveredImageId(image._id)}
                  onMouseLeave={() => setHoveredImageId(null)}
                  key={image._id}
                  className="relative w-[200px] h-[200px]"
                >
                  <img
                    src={image.imageUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  {hoveredImageId === image._id && (
                    <div
                      onClick={() => handleClick(image._id)}
                      className=" cursor-pointer absolute w-full h-full bg-red-500 bg-opacity-50 top-0 left-0 flex items-center justify-center"
                    >
                      <FaTrash className="text-2xl" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GallerySet;
