import React, { useEffect, useReducer, useState } from "react";
import { getall } from "../../../components/services/FoodServices";
import Price from "../../menu/components/Price";
import axios from "../../../api/axios";
import { FiRefreshCcw } from "react-icons/fi";

const initialstate = { foods: [], tags: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "FOODS_LOADED":
      return { ...state, foods: action.payload };

    default:
      return state;
  }
};

const ProductsTable = () => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  const { foods } = state;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadFoods = getall();
    loadFoods.then((foods) =>
      dispatch({ type: "FOODS_LOADED", payload: foods })
    );
  }, [count]);

  const handleClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`foods/delete/${id}`);
        alert("Product deleted successfully!");
        setCount((prevCount) => prevCount + 1); // Update count to refresh the list
      } catch (err) {
        console.log(err);
        alert("Failed to delete the product. Please try again.");
      }
    } else {
      alert("Product deletion canceled.");
    }
  };

  return (
    <div>
      <div
        id="style-6"
        className="relative  max-h-screen scrollbar pt-[40px] overflow-x-auto shadow-md sm:rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div
            onClick={() => {
              setCount((prevCount) => prevCount + 1);
            }}
            className="text-white flex items-center gap-[10px] cursor-pointer"
          >
            <h1 className="pl-[15px]">Actualiser</h1>
            <FiRefreshCcw />
          </div>
          <h1 className="text-white pr-[15px]">Total: {foods.length}</h1>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                image
              </th>
              <th scope="col" className="px-6 py-3">
                name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No products available
                </td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr
                  key={food._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      src={food.imageUrl}
                      alt=""
                      className="max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px]"
                    />
                  </th>
                  <td className="px-6 py-4">{food.name}</td>
                  <td className="px-6 py-4">{food.tags.join(", ")}</td>
                  <td className="px-6 py-4">
                    <Price price={food.price} />
                  </td>
                  <td className="px-6 py-4">
                    <h1
                      onClick={() => handleClick(food._id)}
                      className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      delete
                    </h1>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
