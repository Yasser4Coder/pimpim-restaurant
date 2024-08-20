import axios from "../api/axios";
import React, { useEffect, useState } from "react";

const StatusAd = () => {
  const [status, setStatus] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("stat/status");
        setStatus(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []); // Fetch only on component mount

  return (
    <div className="fixed left-0 z-50 top-[20%] h-[20%] rounded-r-xl flex items-center">
      <div
        onClick={() => setToggle(!toggle)}
        className={`h-full w-[80%] ${
          status[0]?.status ? "bg-green-500" : "bg-red-500"
        } flex items-center justify-center cursor-pointer`}
      >
        <h1 className="rotate-90 font-semibold">
          {status[0]?.status ? "Ouverte" : "Fermée"}
        </h1>
      </div>
      {toggle && status[0] && (
        <div
          onClick={() => setToggle(!toggle)}
          className={`h-full w-full rounded-r-xl cursor-pointer py-[3px] px-[10px] flex text-center items-center justify-center ${
            status[0].status ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status[0].text}
        </div>
      )}
    </div>
  );
};

export default StatusAd;
