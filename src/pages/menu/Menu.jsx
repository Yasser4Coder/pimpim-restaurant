import React, { useEffect, useReducer, useState } from "react";
import {
  filterByTag,
  getAllTags,
  getall,
  search,
} from "../../components/services/FoodServices";
import Thumbnails from "./components/Thumbnails";
import { useParams } from "react-router-dom";
import Search from "./components/Search";
import Tags from "./components/Tags";

const initialstate = { foods: [], tags: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "FOODS_LOADED":
      return { ...state, foods: action.payload };

    case "TAGS_LOADED":
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

const Menu = () => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load categories
        const categoriesData = await getAllTags();
        dispatch({ type: "TAGS_LOADED", payload: categoriesData });

        // Load foods based on search/filter
        let foodsData;
        if (searchTerm) {
          foodsData = await search(searchTerm);
        } else if (tag) {
          foodsData = await filterByTag(tag);
        } else {
          foodsData = await getall();
        }

        dispatch({ type: "FOODS_LOADED", payload: foodsData });
      } catch (err) {
        console.error("Error loading menu data:", err);
        setError(
          "Échec du chargement des articles du menu. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchTerm, tag]);

  return (
    <div className="min pb-[40px] bg-slate-500">
      <Search />
      <Tags tags={tags} />
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold mb-2">Erreur</p>
            <p>{error}</p>
          </div>
        </div>
      ) : foods.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500 text-center">
            <p className="text-lg font-semibold mb-2">Aucun article trouvé</p>
            <p>
              {searchTerm
                ? `Aucun article du menu trouvé pour "${searchTerm}"`
                : tag
                ? `Aucun article trouvé dans la catégorie "${tag}"`
                : "Aucun article du menu disponible pour le moment"}
            </p>
          </div>
        </div>
      ) : (
        <Thumbnails foods={foods} />
      )}
    </div>
  );
};

export default Menu;
