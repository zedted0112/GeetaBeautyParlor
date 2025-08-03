import React from "react";
import { backgroundImages, logoImages } from '../../utils/imageImports';

const bg2 = backgroundImages.footer;
const footerLogo = logoImages.primary;
import { MdOutlineFacebook } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import { RiWhatsappFill } from "react-icons/ri";

const Contact = () => {
  return (
    <div
      id="contact"
      className="w-full scroll-target"
      style={{
        backgroundImage: `url('${bg2}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        objectFit: "cover",
      }}
    >
      <div className="w-[80%] h-full mx-auto max-w-[1200px] md:pt-28 md:pb-16 py-12">
        <div className="flex flex-col gap-y-6">
          <h1 className="text-white md:text-[40px] text-[30px] leading-[46.08px] tracking-widest">
            Geeta Makeovers
          </h1>
          <p className="text-gray-200 text-[18px] leading-[20.74px] tracking-widest">
            Discover the essence of timeless beauty at Glamour Palette. With a commitment to excellence, we strive to create an atmosphere where every individual feels empowered and confident. Our skilled team of beauty professionals is dedicated to delivering personalized experiences tailored to your unique style and preferences.
          </p>
          <p className="text-gray-200 text-[18px] leading-[20.74px] tracking-widest">
            Whether it's a glamorous makeover, a rejuvenating skincare session, or a stunning bridal look, we're here to make your beauty dreams a reality. Step into our sanctuary of elegance and let us unveil the true radiance within you.
          </p>
        </div>
        <div className="flex md:flex-row flex-col lg:gap-28 gap-8 md:py-16 py-12">
          <div>
            <img
              src={footerLogo}
              width={150}
              height={150}
              className="md:w-[150px] md:h-[150px] w-[100px] h-[100px]"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-white md:text-[24px] text-[20px] leading-[27.65px] tracking-widest">
                BEAUTY CONSULTANTS
              </h1>
              <h2 className="text-gray-300 uppercase text-[16px] leading-[32px] tracking-widest">
                Geeta Semwal
              </h2>
              <h2 className="text-gray-300 uppercase text-[16px] leading-[32px] tracking-widest">
                Anshul | +91 xxxxxx6360
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-white md:text-[24px] text-[20px] leading-[27.65px] tracking-widest">
                EMAIL
              </h1>
              <h2 className="text-gray-300 uppercase text-[16px] leading-[32px] tracking-widest">
                GeetaMakeovers@gmail.com
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-white md:text-[24px] text-[20px] leading-[27.65px] tracking-widest">
                ADDRESS
              </h1>
              <h2 className="uppercase text-gray-300 text-[16px] leading-[32px] tracking-widest">
                Uttarkashi
                <br />
                Uttarkashi, INDIA
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-white md:text-[24px] text-[20px] leading-[27.65px] tracking-widest pb-2">
                SOCIALS
              </h1>
              <div className="flex flex-row gap-2">
                <div className="w-[30px] h-[30px] border border-gray-300 py-1 rounded-full">
                  <MdOutlineFacebook className="w-[20px] h-[19px] mx-auto text-gray-300" />
                </div>
                <div className="w-[30px] h-[30px] border border-gray-300 py-1 rounded-full">
                  <RiInstagramFill className="w-[20px] h-[19px] mx-auto text-gray-300" />
                </div>
                <div className="w-[30px] h-[30px] border border-gray-300 py-1 rounded-full">
                  <RiWhatsappFill className="w-[20px] h-[19px] mx-auto text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 