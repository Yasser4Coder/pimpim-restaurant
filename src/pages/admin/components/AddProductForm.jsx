import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
import axios from "../../../api/axios";

const AddProductForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requiredInfo, setRequiredInfo] = useState(false);
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("");
  const [stars, setStars] = useState(0);

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
    formData.append("name", name);
    formData.append("price", price);
    formData.append("tag", tag);
    formData.append("stars", stars);

    await axios
      .post("foods/addfood", formData)
      .then(() => {
        setLoading(false);
        setMessage(true);
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
  return (
    <section className="text-white body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-yellow-500">
            Ajouter un produit
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify.
          </p>
          {message && (
            <p className="text-green-500">
              Le produit a été ajouté avec succès !
            </p>
          )}
          {requiredInfo && (
            <p className="text-red-500">
              Certaines informations requises sont manquantes
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="lg:w-1/2 md:w-2/3 mx-auto relative"
        >
          {loading && (
            <div className="w-full h-full absolute top-0 left-0 z-50 bag flex items-center justify-center">
              <div class="loader"></div>
            </div>
          )}
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="name" className="leading-7 text-sm text-white">
                  Nom du produit
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label
                  htmlFor="Category"
                  className="leading-7 text-sm text-white"
                >
                  Catégorie
                </label>
                <input
                  onChange={(e) => setTag(e.target.value.toLowerCase())}
                  type="text"
                  id="Category"
                  name="Category"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="price" className="leading-7 text-sm text-white">
                  Prix
                </label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  id="price"
                  name="price"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label htmlFor="stars" className="leading-7 text-sm text-white">
                  Étoiles (nombre entre 1 et 5)
                </label>
                <input
                  onChange={(e) => setStars(e.target.value)}
                  type="number"
                  id="stars"
                  name="stars"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-full">
              <div className="relative flex flex-col gap-[10px]">
                <label htmlFor="image" className="leading-7 text-sm text-white">
                  Image du produit : (la taille du fichier doit être de 6 Mo ou
                  moins et le type doit être png, jpg ou jpeg)
                </label>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <FileBase64
                  type="file"
                  id="image"
                  name="image"
                  multiple={false}
                  onDone={handleUpload}
                  handleUpload
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="w-full gap-[20px] flex items-center justify-center bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  {selectedFile && (
                    <img
                      src={selectedFile}
                      className="w-[40%] h-[90%]"
                      alt=""
                    />
                  )}
                  <p>Télécharger l'image</p>
                </label>
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              >
                Sauvegarder
              </button>
            </div>
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
              <Link className="text-indigo-500">example@email.com</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProductForm;
