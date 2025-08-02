import React from "react";
import bgWhite from "/BG1.png";
import architect from "../../assets/mua.jpg";

const Mua = () => {
  return (
    <div className="w-full bg-gradient-to-br from-[#937D64] via-[#A08B73] to-[#8B7355]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
              <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                Expert Makeup Artist
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Meet Your
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2">
                Beauty Expert
              </span>
            </h1>
            
            {/* Description */}
            <div className="space-y-6 text-lg md:text-xl text-white/90 leading-relaxed">
              <p>
                With over 15 years of experience in the beauty industry, our lead makeup artist brings 
                expertise, creativity, and passion to every transformation. Specializing in bridal makeup, 
                special occasions, and everyday glamour.
              </p>
              <p>
                From traditional Indian bridal looks to modern contemporary styles, we create 
                personalized beauty experiences that enhance your natural features and boost your confidence.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-white">Creative Design</h3>
                <p className="text-sm text-white/80">Unique looks for every occasion</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-white">Premium Quality</h3>
                <p className="text-sm text-white/80">Luxury products & techniques</p>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button className="bg-white text-[#937D64] px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Book Consultation
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={architect}
                alt="Professional Makeup Artist"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl transition-all duration-700 ease-in-out hover:scale-105"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Section */}
      <div
        className="w-full h-32 lg:h-40"
        style={{
          backgroundImage: `url('${bgWhite}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default Mua;
