import React from "react";
import { Link } from "react-router-dom";

const Tags = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="mt-[30px] text-white container mx-auto flex items-center justify-center">
        <p className="text-gray-300">Aucune catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="mt-[30px] text-white container mx-auto flex items-center justify-center gap-[20px] flex-wrap">
      {tags.map((tag, index) => (
        <Link
          key={index}
          to={
            tag.name.toLowerCase() === "all"
              ? "/menu"
              : `/menu/tags/${tag.name.toLowerCase()}`
          }
          className="py-[5px] px-[7px] rounded-lg bg-purple-900 hover:bg-purple-800 transition-colors"
        >
          {tag.name} ({tag.count})
        </Link>
      ))}
    </div>
  );
};

export default Tags;
