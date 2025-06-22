import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "../../components/services/FoodServices";
import {
  FaHeart,
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaCheck,
  FaPlus,
  FaClock,
} from "react-icons/fa";
import { MdRestaurant, MdCategory } from "react-icons/md";
import ReactStars from "react-stars";
import Price from "../menu/components/Price";
import { useDispatch } from "react-redux";
import { addToCart, increCount } from "../../features/cartSlice";
import toast from "react-hot-toast";
import settingsApi from "../../api/settingsApi";

const Food = () => {
  const [food, setFood] = useState();
  const [value, setValue] = useState(1);
  const [foodId, setFoodId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState({
    isOpen: true,
    name: "PimPim",
  });
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFood = async () => {
      setLoading(true);
      setError(null);
      try {
        const foodData = await getFoodById(id);
        if (foodData) {
          setFood(foodData);
          setFoodId(foodData._id);
        } else {
          setError("Cet article du menu n'est pas disponible pour le moment");
        }
      } catch (err) {
        console.error("Error loading food:", err);
        setError("Échec du chargement des détails de l'article");
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  // Fetch restaurant status
  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        const response = await settingsApi.get();
        setRestaurantStatus({
          isOpen: response.data.isOpen,
          name: response.data.name || "PimPim",
        });
      } catch (error) {
        console.error("Error fetching restaurant status:", error);
        // Keep default values if fetch fails
      }
    };

    fetchRestaurantStatus();
  }, []);

  const handleClick = async () => {
    if (!food || addingToCart) return;

    // Check if restaurant is open
    if (!restaurantStatus.isOpen) {
      toast.error(
        `${restaurantStatus.name} est actuellement fermé. Impossible d'ajouter des articles au panier.`,
        {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            border: "1px solid #b91c1c",
          },
        }
      );
      return;
    }

    setAddingToCart(true);

    // Simulate a brief loading state for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch(
      addToCart({
        id: food._id,
        name: food.name,
        price: food.price,
        description: food.description,
        rating: food.rating || 0,
        image: food.image,
        totalPrice: food.price * value,
        quantity: value,
      })
    );
    dispatch(increCount({ id: foodId, count: value }));

    setAddingToCart(false);
    setShowSuccess(true);

    // Show success toast with more details
    toast.success(
      <div className="flex items-center">
        <FaCheck className="text-green-400 mr-2" />
        <div>
          <div className="font-semibold">Ajouté au Panier !</div>
          <div className="text-sm text-gray-300">
            {value}x {food.name} - <Price price={food.price * value} />
          </div>
        </div>
      </div>,
      {
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      }
    );

    // Keep success state visible permanently - removed timeout
    // setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <div className="min">
        <div className="container mx-auto px-4 pt-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="loader mb-4"></div>
              <p className="text-white text-lg">
                Chargement des détails délicieux...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min">
        <div className="container mx-auto px-4 pt-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="bg-red-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <MdRestaurant className="text-red-400 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Article Non Disponible
              </h2>
              <p className="text-gray-300 mb-8">{error}</p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <FaArrowLeft className="inline mr-2" />
                Retour au Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min">
      <div className="container mx-auto px-4 pt-20 pb-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/menu")}
          className="mb-8 inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Retour au Menu
        </button>

        {food ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image Section */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-2xl"></div>
                  )}
                  <img
                    src={food.image}
                    alt={food.name}
                    onLoad={handleImageLoad}
                    className={`w-full h-[400px] lg:h-[500px] object-cover transition-all duration-500 ${
                      imageLoading
                        ? "opacity-0"
                        : "opacity-100 group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-semibold text-gray-800">
                    {food.rating || 0}
                  </span>
                </div>

                {/* Success Animation Overlay */}
                {showSuccess && (
                  <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                    <div className="bg-green-500 text-white rounded-full p-4 animate-bounce">
                      <FaCheck className="text-2xl" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                {/* Title and Category */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {food.name}
                  </h1>
                  {food.category && (
                    <div className="flex items-center text-purple-400 mb-4">
                      <MdCategory className="mr-2" />
                      <span className="text-sm font-medium">
                        {food.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <ReactStars
                    count={5}
                    size={24}
                    value={food.rating || 0}
                    color2={"#FFD700"}
                    edit={false}
                  />
                  <span className="text-gray-300 text-sm">
                    {food.rating || 0} étoiles
                  </span>
                </div>

                {/* Description */}
                {food.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      Prix
                    </span>
                    <span className="text-2xl font-bold text-yellow-400">
                      <Price price={food.price} />
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Quantité
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setValue(Math.max(1, value - 1))}
                      className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
                    >
                      <FaPlus className="rotate-45" />
                    </button>
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {value}
                    </span>
                    <button
                      onClick={() => setValue(value + 1)}
                      className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {!restaurantStatus.isOpen ? (
                  <div className="space-y-3">
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <FaClock className="text-red-400 mr-2" />
                        <span className="text-red-400 font-semibold">
                          Restaurant Fermé
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {restaurantStatus.name} est actuellement fermé.
                        Impossible d'ajouter des articles au panier.
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full py-4 rounded-xl font-semibold text-lg bg-gray-600 cursor-not-allowed text-gray-400 flex items-center justify-center"
                    >
                      <FaClock className="mr-3" />
                      Restaurant Fermé
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleClick}
                    disabled={addingToCart}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                      addingToCart
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-2xl"
                    }`}
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Ajout en Cours...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-3" />
                        Ajouter au Panier - <Price price={food.price * value} />
                      </>
                    )}
                  </button>
                )}

                {/* View Cart Button - Shows after adding to cart */}
                {showSuccess && (
                  <Link
                    to="/cart"
                    className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black hover:shadow-2xl"
                  >
                    <FaShoppingCart className="mr-3" />
                    Voir le Panier
                  </Link>
                )}

                {/* Additional Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Informations Supplémentaires
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Préparation fraîche à la commande</p>
                    <p>• Ingrédients de qualité premium</p>
                    <p>• Livraison rapide disponible</p>
                    <p>• Satisfaction garantie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Food;
