import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Price from "../menu/components/Price";
import {
  removeFromCart,
  increCount,
  decrementCount,
  clearCart,
} from "../../features/cartSlice";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaArrowLeft,
  FaPhone,
  FaExclamationTriangle,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaPaperPlane,
  FaHeadset,
  FaClock,
} from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import toast from "react-hot-toast";
import orderApi from "../../api/orderApi";
import settingsApi from "../../api/settingsApi";

// Custom Confirmation Modal
const ClearCartModal = ({
  show,
  onClose,
  onConfirm,
  totalCount,
  totalPrice,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20 animate-fade-in">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2">Vider le Panier</h3>

          {/* Message */}
          <p className="text-gray-300 mb-6">
            Êtes-vous sûr de vouloir supprimer tous les articles de votre panier
            ? Cette action ne peut pas être annulée.
          </p>

          {/* Item Count */}
          <div className="bg-white/10 rounded-lg p-3 mb-6">
            <p className="text-white font-semibold">
              {totalCount} article{totalCount !== 1 ? "s" : ""} •{" "}
              <Price price={totalPrice} />
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <FaTrash className="mr-2" />
              Vider le Panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Form Modal
const OrderFormModal = ({
  show,
  onClose,
  onSubmit,
  orderForm,
  onFormChange,
  isSubmitting,
  foods,
  totalPrice,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full border border-white/20 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center">
            <FaPaperPlane className="mr-3" />
            Passer Votre Commande
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 flex items-center">
                <FaUser className="mr-2" />
                Nom Complet *
              </label>
              <input
                type="text"
                name="customerName"
                value={orderForm.customerName}
                onChange={onFormChange}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Entrez votre nom complet"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 flex items-center">
                <FaPhone className="mr-2" />
                Numéro de Téléphone *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={orderForm.phoneNumber}
                onChange={onFormChange}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Entrez votre numéro de téléphone"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-white font-semibold mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Adresse de Livraison *
            </label>
            <textarea
              name="address"
              value={orderForm.address}
              onChange={onFormChange}
              rows="3"
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Entrez votre adresse de livraison complète"
              required
            />
          </div>

          {/* Options supplémentaires */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Options supplémentaires
            </label>
            <textarea
              name="deliveryInstructions"
              value={orderForm.deliveryInstructions}
              onChange={onFormChange}
              rows="2"
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Des options ou demandes spéciales ?"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">
              Résumé de la Commande
            </h4>
            <div className="space-y-2 text-sm">
              {foods.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-300"
                >
                  <span className="truncate mr-2">
                    {item.count}x {item.name}
                  </span>
                  <span className="flex-shrink-0">
                    <Price price={item.totalPrice} />
                  </span>
                </div>
              ))}
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total</span>
                  <span>
                    <Price price={totalPrice} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-2xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                <span className="text-sm sm:text-base md:text-lg">
                  Passage de Commande...
                </span>
              </>
            ) : (
              <>
                <FaPaperPlane className="text-sm sm:text-base md:text-lg" />
                <span className="text-sm sm:text-base md:text-lg">
                  Passer la Commande
                </span>
                <span className="text-sm sm:text-base md:text-lg font-bold">
                  - <Price price={totalPrice} />
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Order Success Modal
const OrderSuccessModal = ({ show, onClose, order }) => {
  const navigate = useNavigate();
  if (!show || !order) return null;

  const handleTrackOrder = () => {
    const orderNumber = order.displayOrderNumber?.replace(/^#/, "");
    navigate(`/track/${orderNumber}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20 animate-fade-in text-center">
        {/* Success Icon */}
        <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">
          Commande Passée avec Succès !
        </h3>

        {/* Message */}
        <p className="text-gray-300 mb-4">
          Merci pour votre commande. Nous l'avons reçue et commencerons à la
          préparer immédiatement.
        </p>

        {/* Order Number */}
        <div className="bg-white/10 rounded-lg p-4 text-center mb-6">
          <p className="text-gray-300 text-sm">Votre Numéro de Commande :</p>
          <p className="text-white font-bold text-2xl tracking-wider">
            {order.displayOrderNumber}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTrackOrder}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Suivre ma Commande
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const foods = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [restaurantStatus, setRestaurantStatus] = useState({
    isOpen: true,
    name: "PimPim",
    supportPhone: "",
  });

  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    deliveryInstructions: "",
    paymentMethod: "cash",
  });

  // Fetch restaurant status
  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        const response = await settingsApi.get();
        setRestaurantStatus({
          isOpen: response.data.isOpen,
          name: response.data.name || "PimPim",
          supportPhone: response.data.contact?.supportPhone || "",
        });
      } catch (error) {
        console.error("Error fetching restaurant status:", error);
        // Keep default values if fetch fails
      }
    };

    fetchRestaurantStatus();
  }, []);

  const totalPrice = foods.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCount = foods.reduce((sum, item) => sum + item.count, 0);

  const handleQuantityChange = (item, newCount) => {
    if (newCount > 0) {
      dispatch(increCount({ id: item.id, count: newCount }));
    }
  };

  const handleRemoveItem = async (item) => {
    setRemovingItem(item.id);

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch(removeFromCart({ id: item.id }));
    setRemovingItem(null);

    toast.success(`${item.name} supprimé du panier`);
  };

  const handleClearCart = () => {
    if (foods.length === 0) return;
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    dispatch(clearCart());
    setShowClearModal(false);
    toast.success("Panier vidé avec succès");
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Check if restaurant is open
    if (!restaurantStatus.isOpen) {
      toast.error(
        "Le restaurant est actuellement fermé. Impossible de passer une commande."
      );
      return;
    }

    // Basic validation
    if (
      !orderForm.customerName.trim() ||
      !orderForm.phoneNumber.trim() ||
      !orderForm.address.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: orderForm.customerName,
          phone: orderForm.phoneNumber,
          address: orderForm.address,
        },
        items: foods.map((item) => ({
          menuItem: item.id,
          quantity: item.count,
          price: item.price,
        })),
        notes: orderForm.deliveryInstructions,
      };

      // Use the real API to create the order
      const response = await orderApi.create(orderData);

      setCompletedOrder(response.data);
      setShowSuccessModal(true);
      setShowOrderForm(false);
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Échec du passage de commande. Veuillez réessayer.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    dispatch(clearCart());
    setOrderForm({
      customerName: "",
      phoneNumber: "",
      address: "",
      deliveryInstructions: "",
      paymentMethod: "cash",
    });
    navigate("/");
  };

  if (foods.length === 0) {
    return (
      <div className="min">
        <div className="container mx-auto px-4 pt-20 pb-10">
          <button
            onClick={() => navigate("/menu")}
            className="mb-8 inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Retour au Menu
          </button>

          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md px-4">
              <div className="bg-purple-500/20 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-purple-400 text-3xl md:text-4xl" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Votre Panier est Vide
              </h2>
              <p className="text-gray-300 mb-8 text-sm md:text-base">
                Il semble que vous n'ayez pas encore ajouté d'articles délicieux
                à votre panier. Commencez à explorer notre menu !
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105"
              >
                <MdRestaurant className="mr-3" />
                Explorer le Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min">
      <div className="container mx-auto px-4 pt-20 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300 text-sm md:text-base"
          >
            <FaArrowLeft className="mr-2" />
            Retour au Menu
          </button>

          {/* Restaurant Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                restaurantStatus.isOpen
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  restaurantStatus.isOpen ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span>{restaurantStatus.isOpen ? "Ouvert" : "Fermé"}</span>
            </div>
          </div>

          <button
            onClick={handleClearCart}
            className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors duration-300 text-sm md:text-base"
          >
            <FaTrash className="mr-2" />
            Vider le Panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                <FaShoppingCart className="mr-3" />
                Votre Panier ({totalCount} articles)
              </h2>

              <div className="space-y-3 md:space-y-4">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className={`bg-white/5 rounded-lg p-3 md:p-4 transition-all duration-300 ${
                      removingItem === food.id ? "opacity-50 scale-95" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                      {/* Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-purple-500"
                        />
                        {food.category && (
                          <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-purple-600 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full">
                            {food.category}
                          </span>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base md:text-lg truncate">
                          {food.name}
                        </h3>
                        {food.description && (
                          <p className="text-gray-300 text-xs md:text-sm line-clamp-2 hidden sm:block">
                            {food.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 md:mt-2">
                          <Price price={food.price} />
                          <span className="text-gray-400 text-xs md:text-sm">
                            par article
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(food, food.count - 1)
                          }
                          disabled={food.count <= 1}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>

                        <span className="text-white font-semibold min-w-[1.5rem] md:min-w-[2rem] text-center text-sm md:text-base">
                          {food.count}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(food, food.count + 1)
                          }
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-bold text-purple-400">
                          <Price price={food.totalPrice} />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(food)}
                        disabled={removingItem === food.id}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 p-1 md:p-2"
                      >
                        <FaTrash className="text-sm md:text-base" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 sticky top-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                Résumé de la Commande
              </h2>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-gray-300 text-sm md:text-base">
                  <span>Articles ({totalCount})</span>
                  <span>{totalCount}</span>
                </div>

                <div className="border-t border-white/20 pt-3 md:pt-4">
                  <div className="flex justify-between text-lg md:text-xl font-bold text-white">
                    <span>Total</span>
                    <span>
                      <Price price={totalPrice} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="space-y-3 md:space-y-4">
                {!restaurantStatus.isOpen ? (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FaClock className="text-red-400 mr-2" />
                      <span className="text-red-400 font-semibold">
                        Restaurant Fermé
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {restaurantStatus.name} est actuellement fermé. Impossible
                      de passer une commande pour le moment.
                    </p>
                    <button
                      disabled
                      className="w-full bg-gray-600 cursor-not-allowed text-gray-400 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg mt-3"
                    >
                      <FaClock className="mr-3 inline" />
                      Restaurant Fermé
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <FaPaperPlane className="mr-3" />
                    Passer la Commande
                  </button>
                )}
              </div>

              {/* Support Contact */}
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg text-center">
                <h3 className="font-semibold text-blue-400 mb-2 flex items-center justify-center">
                  <FaHeadset className="mr-2" />
                  Besoin d'Aide ?
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Des difficultés ? Appelez-nous pour le support :
                </p>
                {restaurantStatus.supportPhone ? (
                  <a
                    href={`tel:${restaurantStatus.supportPhone}`}
                    className="block text-white text-lg font-bold tracking-widest hover:text-blue-300 transition-colors duration-300"
                  >
                    📞 {restaurantStatus.supportPhone}
                  </a>
                ) : (
                  <span className="block text-white text-lg font-bold tracking-widest">
                    Numéro non disponible
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Clear Cart Modal */}
      <ClearCartModal
        show={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearCart}
        totalCount={totalCount}
        totalPrice={totalPrice}
      />

      {/* Order Form Modal */}
      <OrderFormModal
        show={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onSubmit={handleSubmitOrder}
        orderForm={orderForm}
        onFormChange={handleOrderFormChange}
        isSubmitting={isSubmitting}
        foods={foods}
        totalPrice={totalPrice}
      />

      <OrderSuccessModal
        show={showSuccessModal}
        onClose={handleCloseSuccessModal}
        order={completedOrder}
      />
    </div>
  );
};

export default Cart;
