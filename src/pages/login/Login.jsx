import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axios from "../../api/axios";
import logo from "../../images/306930671_3283853568599185_1930342004374579919_n-removebg-preview.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/auth/login", { email, password });
      // No need to store token, just redirect
      if (res.data.user.role === 1012) {
        navigate("/admin");
      } else if (res.data.user.role === 1001) {
        navigate("/delivery");
      } else {
        setError("Rôle non autorisé");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min flex items-center justify-center min-h-screen"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 md:p-8 border border-white/20 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 mb-2 rounded-full shadow"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
            Connexion
          </h2>
          <p className="text-sm md:text-base text-gray-100 text-center">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>
        {error && (
          <div className="text-red-400 mb-2 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-100">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/90 backdrop-blur-sm text-gray-900"
              placeholder="Entrez votre email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-100">
              Mot de passe
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/90 backdrop-blur-sm text-gray-900"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 text-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
