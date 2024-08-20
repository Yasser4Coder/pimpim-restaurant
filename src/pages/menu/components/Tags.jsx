import React from "react";
import { Link } from "react-router-dom";

const Tags = ({ tags }) => {
  return (
    <div className="mt-[30px] text-white container mx-auto flex items-center justify-center gap-[20px]">
      {tags ? (
        tags.map((tag) => (
          <Link
            to={
              tag.name.toLowerCase() === "all"
                ? "/menu"
                : `/menu/tags/${tag.name.toLowerCase()}`
            }
            className="py-[5px] px-[7px] rounded-lg bg-purple-900"
          >
            {tag.name} ({tag.count})
          </Link>
        ))
      ) : (
        <p>there is no tag</p>
      )}
    </div>
  );
};

export default Tags;
