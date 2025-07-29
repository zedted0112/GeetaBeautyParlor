import React from "react";
import bgWhite from "/BG1.png";
import architect from "../../assets/mua.jpg";

const Mua = () => {
  return (
    <div className="w-full bg-[#937D64AD] ">
      <div className="relative w-[80%] h-full mx-auto max-w-[1200px] flex md:flex-row flex-col-reverse gap-20 items-center">
        <div className="md:w-[55%] md:pt-28 md:pb-28 pb-12 lg:pl-10 flex flex-col lg:gap-12 gap-6">
          <h1 className="text-[32px] text-[#1E1E1E] leading-[36.86px] tracking-widest">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, possimus sit quibusdam, cumque praesentium dolor, commodi voluptatem soluta nihil dicta corporis ullam rerum quisquam esse? Esse veniam fugiat voluptates provident?
          </h1>
          <p className="text-[21px] leading-[33px] text-[#1E1E1E]">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nemo maxime, accusantium provident iste officiis exercitationem, tempora in ratione dicta incidunt illo, cupiditate voluptate obcaecati aut quod! Ex, sit maiores.
          </p>
          <p className="text-[21px] leading-[33px] text-[#1E1E1E]">
           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde temporibus magnam velit nihil cupiditate neque voluptate, earum atque dolore est! Deleniti doloremque voluptas obcaecati sit itaque animi consectetur sequi impedit!
          </p>
        </div>

        <div className="md:w-[45%] md:absolute md:right-0 lg:pl-20 md:pl-4 pl-0 flex items-center" style={{ top: '0px' }}>
          <img
            src={architect}
            width={445}
            height={651}
            className="w-[440px] h-[651px] object-cover transition-all duration-700 ease-in-out hover:scale-95 rounded-[200px]"
            alt="Architect"
          />
        </div>
      </div>

      <div
        className="w-full lg:block hidden h-60"
        style={{
          backgroundImage: `url('${bgWhite}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
      ></div>
    </div>
  );
};

export default Mua;
