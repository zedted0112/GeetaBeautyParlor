import { backgroundImages, serviceImages } from '../../utils/imageImports';

const bgImage = backgroundImages.footer;
const bridalImage = serviceImages.bridal.main3;

import React from "react";
const AboutInfo = () => {
  return (
    <div
      className="w-full bg-[#937D64AD]"
     
    >
      <div className="md:pt-32 py-12 flex md:flex-row flex-col md:p-0 p-10">
        <div
          className="md:w-[50%] w-full md:h-[750px] h-[500px] brightness-50  rounded-tr-[54px]"
          style={{
            backgroundImage: `url('${infoPeople}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            objectFit: "cover",
            backgroundPosition:"center"
          }}
        >
        </div>

        <div className="md:w-[50%] h-full mx-auto max-w-[1200px] flex flex-col gap-12 md:pl-12 lg:pr-32 md:pr-16 pb-24 md:px-10">
          <h1 className="md:text-[50px] md:mt-0 mt-5 text-[40px] text-black leading-[57.6px] tracking-[-1.26px]">
          Redefining Beauty in Uttarkashi.
          </h1>
          <p className="text-[20px] text-black leading-[28px] tracking-[-0.5px]">
          Welcome to Geeta Makeovers — where beauty meets serenity in the heart of Uttarkashi.
With over 15 years of experience, we craft timeless looks for every occasion.
From radiant bridal makeovers to everyday elegance, we transform your vision into reality — one brushstroke at a time.                </p>
          <p className="text-[20px] text-black leading-[28px] tracking-[-0.5px]">
          At Geeta Makeovers, beauty isn’t just applied — it’s revealed.
          In the peaceful folds of Uttarkashi, we shape moments into memories and looks into lasting confidence.          </p>
          <button className="bg-[#251408] w-[200px] transition-all duration-700 ease-in-out  hover:scale-95  text-[17px] leading-[19.58px] tracking-[-0.43px] text-white px-8 py-6 rounded-tr-xl">
            More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutInfo;
