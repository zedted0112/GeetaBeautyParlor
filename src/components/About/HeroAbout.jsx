import React from "react";
import heroImageAbout from "/bg-bride2.jpg";
import Header from "../Header";
const HeroAbout = () => {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url('${heroImageAbout}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        objectFit: "cover",
        backgroundPosition:"center",
      }}
    ><div className="w-full h-full bg-[#3b2a17b2]">
      <Header transparent={false}/>
      <div className="w-[80%] h-full mx-auto max-w-[1200px]  md:pt-36 md:pb-56 pt-20 pb-32 flex flex-col gap-6 justify-center items-center">
        <h1 className="md:text-[60px] text-[45px] lg:px-60 text-center text-white md:leading-[80px] tracking-[-2.01px]">
        Revealing the Beauty of Uttarkashi 
        </h1>
        <p className="text-white text-[20px] leading-[35px] lg:w-[50%] md:w-[70%] tracking-[-0.5px] text-center">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores natus aliquid, reiciendis quisquam quasi reprehenderit impedit doloremque itaque minima tenetur, nemo repellendus corporis rem molestiae ab vel? Harum, labore voluptas?        </p>
        <button className="border transition-all duration-700 ease-in-out  hover:scale-95 border-[#937D64]">
          <h1 className="text-white text-[17px] leading-[19.58px] px-14 py-3">
            EXPLORE MORE
          </h1>
        </button>
      </div>
      </div>
    </div>
  );
};

export default HeroAbout;
