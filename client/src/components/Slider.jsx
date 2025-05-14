import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useLocation } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const Slider = ({preview , closepreview}) => {

  return (
    <div className="w-full flex justify-center items-center mt-6 z-50 positon-absolute">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={true}
        navigation={true}
        modules={[Navigation]}
        className="w-[300px] sm:w-[400px] md:w-[500px] rounded-lg shadow-lg"
      >
        {preview && preview.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={"https://res.cloudinary.com/dh72e6lqz/image/upload/v1746116640/Books/SecondMainfile-6813a01bf9295f7b9c733409/preview1.png"}
              alt={`Preview ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;