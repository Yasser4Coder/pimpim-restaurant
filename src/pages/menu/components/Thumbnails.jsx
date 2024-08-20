import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import ReactStars from "react-stars";
import Price from "./Price";

const Thumbnails = ({ foods }) => {
  return (
    <div className="mt-[30px] container mx-auto flex flex-wrap justify-center gap-[20px]">
      {foods?.map((food) => (
        <Link
          key={food._id}
          to={`/food/${food._id}`}
          className="foodCard p-[10px] text-black rounded-lg bg-yellow-500 border-[1px] border-purple-500"
        >
          <img
            width={290}
            height={200}
            className=" rounded-lg object-cover min-w-[290px] min-h-[200px] max-w-[290px] max-h-[200px] bg-cover"
            src={food.imageUrl}
            alt="cover"
          />
          <div className="flex mt-5 flex-col">
            <div className=" flex items-start justify-between">
              <h1 className="font-bold">{food.name}</h1>
              {food.favorite === false ? (
                <FaHeart className="text-xl text-slate-600" />
              ) : (
                <FaHeart className="text-xl text-red-500" />
              )}
            </div>
            <div>
              <ReactStars
                count={5}
                size={24}
                value={food.stars}
                color2={"#FF0000"}
              />
            </div>
            <Price price={food.price} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Thumbnails;
