import React from "react";
import { Link } from "react-router-dom";

const Location = () => {
  return (
    <div className="min">
      <div className="container mx-auto">
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="relative lg:max-w-lg lg:w-full md:w-1/2 w-[90%] mb-10 md:mb-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.4475320870574!2d3.4667642243567607!3d36.75982997225861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e693d0f797ef7%3A0x5994702123325167!2sPimpim!5e0!3m2!1sar!2sdz!4v1723757837073!5m2!1sar!2sdz"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
                className="w-full h-[450px]"
              ></iframe>

              <div className="absolute top-0 right-[-4%] h-[40%] w-[4%] bg-yellow-500"></div>
              <div className="absolute top-[-4%] right-[-4%] h-[4%] w-[40%] bg-yellow-500"></div>
              <div className="absolute bottom-[-4%] left-[-4%] h-[4%] w-[40%] bg-yellow-500"></div>
              <div className="absolute bottom-0 left-[-4%] h-[40%] w-[4%] bg-yellow-500"></div>
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col gap-[30px] md:items-start md:text-left items-center text-center">
              <h1 className="text-yellow-500">Contact</h1>
              <h1 className="title-font text-white sm:text-4xl text-3xl mb-4 font-bold">
                Trouvez-nous
              </h1>
              <Link
                className="text-blue-500"
                target="_blank"
                to="https://www.google.com/maps/place/Pimpim/@36.75983,3.4667642,17z/data=!4m14!1m7!3m6!1s0x128e693d0f797ef7:0x5994702123325167!2sPimpim!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr!3m5!1s0x128e693d0f797ef7:0x5994702123325167!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr?entry=ttu"
              >
                QF57+WMP, Unnamed Road, Boumerdes
              </Link>
              <p className="text-3xl text-yellow-500">Horaires d'ouverture</p>
              <h1 className="text-white">Mon - Fri: 10:00 am - 02:00 am</h1>
              <h1 className="text-white">Sat - Sun: 10:00 am - 03:00 am</h1>
              <div className="flex justify-center xl:justify-start">
                <Link
                  target="_blank"
                  className="py-2 px-4 bg-yellow-500 font-bold text-black text-base md:text-lg text-center rounded-lg"
                  to="https://www.google.com/maps/place/Pimpim/@36.75983,3.4667642,17z/data=!4m14!1m7!3m6!1s0x128e693d0f797ef7:0x5994702123325167!2sPimpim!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr!3m5!1s0x128e693d0f797ef7:0x5994702123325167!8m2!3d36.75983!4d3.4641893!16s%2Fg%2F11gy8hgrtr?entry=ttu"
                >
                  Visitez-nous
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Location;
