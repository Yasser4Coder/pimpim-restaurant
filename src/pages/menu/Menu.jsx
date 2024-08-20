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

  useEffect(() => {
    const loadTags = getAllTags();
    setLoading(true);
    loadTags.then((tags) => dispatch({ type: "TAGS_LOADED", payload: tags }));

    const loadFoods = searchTerm
      ? search(searchTerm)
      : tag
      ? filterByTag(tag)
      : getall();

    loadFoods.then((foods) =>
      dispatch({ type: "FOODS_LOADED", payload: foods })
    );
    setLoading(false);
  }, [searchTerm, tag]);
  return (
    <div className="min pb-[40px] bg-slate-500">
      <Search />
      <Tags tags={tags} />
      {loading === true ? (
        <div className="flex items-center justify-center">
          <div class="loader"></div>
        </div>
      ) : (
        <Thumbnails foods={foods} />
      )}
    </div>
  );
};

export default Menu;
