import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [term, setTerm] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    term ? navigate("/menu/search/" + term) : navigate("/menu");
  };
  return (
    <div className="pt-[30px] container flex items-center justify-center mx-auto">
      <form onSubmit={handleSubmit} className=" flex items-center">
        <input
          onChange={(e) => {
            setTerm(e.target.value);
          }}
          type="text"
          placeholder="recherche..."
          className=" min-w-[200px] p-[10px] rounded-l-lg"
        />
        <button className=" bg-purple-900 p-[10px] rounded-r-lg text-white font-semibold">
          Recherche
        </button>
      </form>
    </div>
  );
};

export default Search;
