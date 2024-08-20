import React from "react";
import { useSelector } from "react-redux";
import Price from "../menu/components/Price";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../features/cartSlice";
import { increCount } from "../../features/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const foods = useSelector((state) => state.cart);
  const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dispatch = useDispatch();

  let totalPrice = 0;
  foods.forEach((element) => {
    totalPrice = parseFloat(totalPrice) + parseFloat(element.totalPrice);
  });

  let totalCount = 0;
  foods.forEach((element) => {
    totalCount = totalCount + element.count;
  });
  return (
    <div className="min">
      <div className=" text-white pt-[40px] pb-[20px] container mx-auto flex flex-col md:flex-row w-full gap-[20px]">
        <div className="cart-itmes costume_bg flex flex-col w-full gap-[20px] border-[2px] border-purple-900 rounded-lg p-[20px]">
          {foods.length !== 0 ? (
            foods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between pb-[15px] border-b-[1px]"
              >
                <img
                  src={food.imageUrl}
                  alt="food_img"
                  className="max-w-[70px] max-h-[70px] w-[70px] h-[70px] bg-cover rounded-lg border-[1px] border-yellow-500"
                />
                <h1>{food.name}</h1>
                <select
                  onChange={(e) => {
                    dispatch(
                      increCount({
                        id: food.id,
                        count: parseInt(e.target.value),
                      })
                    );
                  }}
                  value={food.count}
                  className="text-black"
                >
                  {num.map((num) => (
                    <option value={num}>{num}</option>
                  ))}
                </select>
                <Price price={food.totalPrice} />
                <div
                  onClick={() => {
                    dispatch(removeFromCart({ id: food.id }));
                  }}
                  className="remove px-[10px] py-[5px] text-black bg-yellow-500 rounded-lg cursor-pointer"
                >
                  retirer
                </div>
              </div>
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center w-full h-full gap-[20px]">
              <p>Il n'y a rien dans le panier. Achetez maintenant.</p>
              <Link to="/menu" className="p-[10px] bg-purple-900 rounded-lg">
                Menu
              </Link>
            </div>
          )}
        </div>
        <div className="total_count w-full costume_bg border-[2px] border-purple-900 p-[20px] rounded-lg md:w-[450px] h-full">
          <h1 className="text-center text-xl font-bold">Votre commande</h1>
          <div className="flex flex-col gap-[10px] mt-[50px] text-lg mb-[50px]">
            <h1>commande totale: {totalCount}</h1>
            <h1 className="flex items-center gap-[10px]">
              prix total: <Price price={totalPrice} />
            </h1>
          </div>
          <div className="text-center w-full text-lg p-[10px] font-bold bg-yellow-500 text-black rounded-lg">
            commander sur ce numéro de téléphone: <br />
            06 66 55 44 88 <br />
            07 55 88 77 99
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
