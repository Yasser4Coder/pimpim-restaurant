import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import orderApi from "../../api/orderApi";
import socket from "../../services/socket";
import settingsApi from "../../api/settingsApi";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaTruck,
  FaExclamationTriangle,
  FaSearch,
  FaTimes,
  FaPhone,
} from "react-icons/fa";

// Order Status Progress Bar
const OrderProgressBar = ({ status }) => {
  const statuses = [
    "En Attente",
    "En Préparation",
    "Prêt",
    "En Livraison",
    "Livré",
  ];

  // Map English statuses to French for display
  const statusMapping = {
    Pending: "En Attente",
    Preparing: "En Préparation",
    Ready: "Prêt",
    "Out for Delivery": "En Livraison",
    Delivered: "Livré",
    Cancelled: "Annulé",
  };

  const getStatusIndex = (currentStatus) => {
    // Convert English status to French for comparison
    const frenchStatus = statusMapping[currentStatus] || currentStatus;
    const index = statuses.findIndex(
      (s) => s.toLowerCase() === frenchStatus.toLowerCase()
    );
    return index === -1 ? 0 : index;
  };
  const currentStatusIndex = getStatusIndex(status);

  const statusIcons = {
    "En Attente": <FaClock />,
    "En Préparation": <FaClipboardList />,
    Prêt: <FaBox />,
    "En Livraison": <FaTruck />,
    Livré: <FaCheckCircle />,
    // Also support English statuses
    Pending: <FaClock />,
    Preparing: <FaClipboardList />,
    Ready: <FaBox />,
    "Out for Delivery": <FaTruck />,
    Delivered: <FaCheckCircle />,
    Cancelled: <FaExclamationTriangle />,
  };

  // Get the display status (French if available, otherwise keep original)
  const displayStatus = statusMapping[status] || status;

  return (
    <div className="w-full my-6 md:my-8">
      <div className="flex justify-between items-end relative">
        {statuses.map((s, index) => (
          <div
            key={s}
            className="flex-1 flex flex-col items-center text-center relative z-10"
          >
            <div
              className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-500 ${
                index <= currentStatusIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {statusIcons[s]}
            </div>
            <p
              className={`mt-1 md:mt-2 text-xs md:text-sm font-semibold transition-all duration-500 ${
                index <= currentStatusIndex ? "text-white" : "text-gray-500"
              } hidden sm:block`}
            >
              {s}
            </p>
            <p
              className={`mt-1 md:mt-2 text-xs font-semibold transition-all duration-500 ${
                index <= currentStatusIndex ? "text-white" : "text-gray-500"
              } sm:hidden`}
            >
              {s.split(" ")[0]}
            </p>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-4 md:top-6 left-0 w-full h-1 bg-gray-300 z-0">
          <div
            className="h-1 bg-green-500 transition-all duration-500"
            style={{
              width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Current Status Display */}
      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-white">
          Statut Actuel:{" "}
          <span className="text-yellow-400">{displayStatus}</span>
        </p>
      </div>
    </div>
  );
};

// Order Search Form
const OrderSearchForm = ({ onSearch, loading }) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [inputError, setInputError] = useState("");

  const validateOrderNumber = (value) => {
    // Remove any spaces and # symbols
    const cleanValue = value.replace(/[#\s]/g, "");

    // Check if it's empty
    if (!cleanValue) {
      return "Le numéro de commande est requis";
    }

    // Check if it is 8 alphanumeric characters
    if (!/^[A-Za-z0-9]{8}$/.test(cleanValue)) {
      return "Le numéro de commande doit contenir 8 caractères alphanumériques";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setOrderNumber(value);
    setInputError(validateOrderNumber(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateOrderNumber(orderNumber);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    // Clean the order number (remove # and spaces)
    const cleanOrderNumber = orderNumber.replace(/[#\s]/g, "");
    onSearch(cleanOrderNumber);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 md:p-6 lg:p-8 border border-white/20">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
          Suivre Votre Commande
        </h1>
        <p className="text-sm md:text-base text-gray-200">
          Entrez votre numéro de commande pour suivre son statut en temps réel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={orderNumber}
              onChange={handleInputChange}
              placeholder="Entrez le numéro de commande (ex: ABCD1234)"
              className={`flex-1 px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-sm md:text-base ${
                inputError
                  ? "border-red-400 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            <button
              type="submit"
              disabled={loading || !!inputError}
              className={`px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base ${
                loading || inputError
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-400"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-black"></div>
                  <span className="hidden sm:inline">Recherche...</span>
                  <span className="sm:hidden">Recherche</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span className="hidden sm:inline">Suivre</span>
                  <span className="sm:hidden">Suivre</span>
                </>
              )}
            </button>
          </div>
          {inputError && (
            <p className="text-red-400 text-xs md:text-sm text-left">
              {inputError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

// Order Details Component
const OrderDetails = ({ order, onClose, supportPhone }) => {
  // Don't render if order is null or undefined
  if (!order) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 md:p-6 lg:p-8 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Détails de la Commande
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Order Number */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-1">Numéro de Commande</p>
          <p className="text-white font-bold text-2xl md:text-3xl tracking-wider">
            {order.displayOrderNumber}
          </p>
        </div>
      </div>

      {/* Status Progress */}
      <OrderProgressBar status={order.status} />

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Customer Info */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Informations Client
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-300">Nom :</span>
              <span className="text-white ml-2">{order.customer?.name}</span>
            </div>
            <div>
              <span className="text-gray-300">Téléphone :</span>
              <span className="text-white ml-2">{order.customer?.phone}</span>
            </div>
            <div>
              <span className="text-gray-300">Adresse :</span>
              <span className="text-white ml-2">{order.customer?.address}</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Informations Commande
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-300">Statut :</span>
              <span className="text-white ml-2 font-semibold">
                {(() => {
                  const statusMapping = {
                    Pending: "En Attente",
                    Preparing: "En Préparation",
                    Ready: "Prêt",
                    "Out for Delivery": "En Livraison",
                    Delivered: "Livré",
                    Cancelled: "Annulé",
                  };
                  return statusMapping[order.status] || order.status;
                })()}
              </span>
            </div>
            <div>
              <span className="text-gray-300">Date :</span>
              <span className="text-white ml-2">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div>
              <span className="text-gray-300">Heure :</span>
              <span className="text-white ml-2">
                {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          Articles Commandés
        </h3>
        <div className="space-y-2">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-white font-medium">
                  {item.menuItem?.name || "Article non disponible"}
                </p>
                <p className="text-gray-300 text-sm">
                  Quantité: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {(item.price * item.quantity).toLocaleString("fr-FR")} DZD
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-xl font-bold text-yellow-400">
            {(order.totalAmount || order.total)?.toLocaleString("fr-FR")} DZD
          </span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
          <p className="text-gray-300">{order.notes}</p>
        </div>
      )}

      {/* Troubleshooting */}
      <div className="bg-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          Besoin d'Aide ?
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Si vous avez des questions concernant votre commande, n'hésitez pas à
          nous contacter :
        </p>
        {supportPhone ? (
          <a
            href={`tel:${supportPhone}`}
            className="block text-white text-lg font-bold tracking-widest hover:text-blue-300 transition-colors duration-300"
          >
            📞 {supportPhone}
          </a>
        ) : (
          <span className="block text-white text-lg font-bold tracking-widest">
            Numéro non disponible
          </span>
        )}
      </div>
    </div>
  );
};

const OrderTracking = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    settingsApi.get().then((res) => {
      setSupportPhone(res.data.contact?.supportPhone || "");
    });
  }, []);

  useEffect(() => {
    // Listen for real-time order updates
    const handleOrderUpdate = (updatedOrder) => {
      if (order && updatedOrder._id === order._id) {
        setOrder(updatedOrder);
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [order]);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const fetchOrder = async (orderNum) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await orderApi.getByOrderNumber(orderNum);
      if (response.data) {
        setOrder(response.data);
      } else {
        setError(
          "Commande non trouvée. Veuillez vérifier le numéro de commande."
        );
        setOrder(null);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      if (err.response?.status === 404) {
        setError(
          "Commande non trouvée. Veuillez vérifier le numéro de commande."
        );
      } else {
        setError(
          "Erreur lors de la récupération de la commande. Veuillez réessayer."
        );
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (orderNum) => {
    navigate(`/track/${orderNum}`);
  };

  const handleCloseOrder = () => {
    setOrder(null);
    setError(null);
    setSearched(false);
    navigate("/track");
  };

  return (
    <div className="min py-[80px]">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Retour à l'Accueil
        </button>

        <div className="max-w-4xl mx-auto">
          {!searched ? (
            <OrderSearchForm onSearch={handleSearch} loading={loading} />
          ) : loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loader mb-4"></div>
                <p className="text-white text-lg">
                  Recherche de votre commande...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20">
              <div className="text-center">
                <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Commande Non Trouvée
                </h2>
                <p className="text-gray-300 mb-6">{error}</p>

                {/* Troubleshooting Tips */}
                <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Conseils de Dépannage :
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Vérifiez que le numéro de commande est correct</li>
                    <li>
                      • Assurez-vous qu'il n'y a pas d'espaces supplémentaires
                    </li>
                    <li>
                      • Le numéro de commande ne doit contenir que des chiffres
                    </li>
                    <li>• Si le problème persiste, contactez-nous</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCloseOrder}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Nouvelle Recherche
                  </button>
                  {supportPhone ? (
                    <a
                      href={`tel:${supportPhone}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                    >
                      <FaPhone className="mr-2" />
                      Nous Appeler
                    </a>
                  ) : (
                    <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center">
                      Numéro non disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <OrderDetails
              order={order}
              onClose={handleCloseOrder}
              supportPhone={supportPhone}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
