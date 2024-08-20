import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const Status = () => {
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState(false);
  const [text, setText] = useState("");
  const maxLength = 70;

  const handleChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("stat/status");
        setStatus(response.data);
        if (response.data[0].status === true) {
          setOpen("bg-green-600 border-[1px] border-black");
          setClose("");
        } else {
          setClose("bg-red-600 border-[1px] border-black");
          setOpen("");
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };
    fetchStatus();
  }, []);

  const handelClickOpen = async () => {
    setOpen("bg-green-600 border-[1px] border-black");
    setClose("");
    try {
      await axios.put("stat/status/66bfd7033594b834a534a326", {
        status: true,
      });
      setToggle(true);
      setTimeout(() => {
        setToggle(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handelClickClose = async () => {
    setClose("bg-red-600 border-[1px] border-black");
    setOpen("");
    try {
      await axios.put("stat/status/66bfd7033594b834a534a326", {
        status: false,
      });
      setToggle(true);
      setTimeout(() => {
        setToggle(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleClickText = async () => {
    try {
      await axios.put("stat/status/66bfd7033594b834a534a326", {
        text: text,
      });
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating text:", err);
    }
  };

  return (
    <div className="min py-[40px]">
      <div className=" container mx-auto flex flex-col gap-[30px] items-center">
        <h1 className="text-white text-xl">État du restaurant</h1>
        <div className="w-[60%]  h-[90px] bg-slate-400 relative rounded-full flex items-center justify-between">
          <div
            onClick={handelClickOpen}
            className={`${open} h-[90px] cursor-pointer w-[50%] rounded-full flex items-center justify-center`}
          >
            Ouverte
          </div>
          <div
            onClick={handelClickClose}
            className={`${close} h-[90px] cursor-pointer w-[50%] rounded-full flex items-center justify-center`}
          >
            Fermée
          </div>
          {toggle && (
            <div className=" absolute rounded-full w-full h-full flex items-center justify-center">
              <h1 className="font-semibold">Attendez quelques secondes...</h1>
            </div>
          )}
        </div>
        <h1 className="text-white text-xl text-center">
          Rédigez une description de l’état du restaurant (cela peut être une
          raison de fermeture ou des mots de bienvenue)
        </h1>
        <div className="text-white">
          {text.length}/{maxLength} characters
        </div>
        <textarea
          onChange={handleChange}
          value={text}
          maxLength={70}
          className="w-[60%] h-[120px] p-[15px] rounded-lg border-[2px] border-purple-800"
        ></textarea>
        <div
          onClick={handleClickText}
          className="px-[20px] py-[10px] bg-yellow-500 rounded-lg cursor-pointer"
        >
          Sauvegarder
        </div>
        {message && (
          <h1 className="text-green-500">
            le texte a été enregistré avec succès
          </h1>
        )}
      </div>
    </div>
  );
};

export default Status;
