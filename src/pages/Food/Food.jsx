import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFoodById } from "../../components/services/FoodServices";
import { FaHeart } from "react-icons/fa";
import ReactStars from "react-stars";
import Price from "../menu/components/Price";
import { useDispatch } from "react-redux";
import { addToCart, increCount } from "../../features/cartSlice";

const Food = () => {
  const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [food, setFood] = useState();
  const [value, setValue] = useState();
  const [foodId, setFoodId] = useState();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getFoodById(id).then(setFood);
  }, [id]);

  const handleClick = () => {
    dispatch(
      addToCart({
        id: food._id,
        name: food.name,
        price: food.price,
        favorite: food.favorite,
        descreption: food.descreption,
        stars: food.stars,
        imageUrl: food.imageUrl,
        totalPrice: food.price,
      })
    );
    dispatch(increCount({ id: foodId, count: value }));
  };

  return (
    <div className="min">
      <div className="text-white container pt-[80px] mx-auto w-full">
        {food ? (
          <div className="flex pb-[20px] flex-col lg:flex-row rounded-lg items-center gap-[50px] w-full">
            <div className="image">
              <img
                src={food.imageUrl}
                className="md:max-w-[602px] object-cover rounded-lg md:max-h-[400px] min-w-[302px] min-h-[100px] md:min-w-[602px] md:min-h-[400px]"
                alt="food_img"
              />
            </div>
            <div className="content flex flex-col gap-[30px] md:w-[500px]">
              <h1 className="title text-3xl font-bold">{food.name}</h1>
              <div className="flex items-center justify-between">
                <ReactStars
                  count={5}
                  size={24}
                  value={food.stars}
                  color2={"#FF0000"}
                />
                <div>
                  {food.favorite === false ? (
                    <FaHeart className="text-xl text-slate-600" />
                  ) : (
                    <FaHeart className="text-xl text-red-500" />
                  )}
                </div>
              </div>
              <div className="text-xl">
                <h1>{food.descreption}</h1>
              </div>
              <div className="text-xl">
                <h1>
                  Prix: <Price price={food.price} />
                </h1>
                <div className="flex items-center gap-[10px]">
                  <h1>Quantité:</h1>
                  <select
                    onChange={(e) => {
                      setValue(parseInt(e.target.value));
                      setFoodId(food._id);
                    }}
                    className="text-black rounded-lg"
                  >
                    {num.map((n) => (
                      <option className="p-[3px]">{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Link
                to="/cart"
                onClick={handleClick}
                className="py-[10px] mt-[40px] flex items-center justify-center text-xl text-white cursor-pointer px-[15px] rounded-lg bg-purple-900"
              >
                Ajouter au panier
              </Link>
            </div>
          </div>
        ) : (
          <p className="flex items-center justify-center">
            Ce plat n'est actuellement pas disponible
          </p>
        )}
      </div>
    </div>
  );
};

export default Food;
