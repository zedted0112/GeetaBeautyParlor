import React from "react";
import { heroImages, serviceImages } from '../../utils/imageImports';
const heroImage = heroImages.aboutMain;
const architect = serviceImages.makeup.artist;

const Mua = () => {
  return (
    <div 
      id="about"
      className="w-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${heroImage}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-gradient-to-b from-black/60 via-black/40 to-black/70">
        <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* TEXT BLOCK */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6 text-white">
                Expert Makeup Artist
              </div>
              <h1 className="text-5xl lg:text-6xl font-semibold mb-6 text-white leading-tight">Meet Your Beauty Expert</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">Crafting timeless elegance through artistry and care.</p>
              <p className="text-lg leading-relaxed mb-10 text-white/90">
                With over 15 years in the beauty industry, our lead artist blends tradition with innovation to create personalized looks that celebrate your natural beauty. Whether it's for your big day or a special moment, each transformation is curated with luxury and love.<br/><br/>
                From intricate Indian bridal glam to chic contemporary styles — your look will be tailored, refined, and unforgettable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <h4 className="text-xl font-semibold mb-3 text-white">🎨 Creative Vision</h4>
                  <p className="text-base text-white/80 leading-relaxed">Bespoke makeup artistry<br />Styles that reflect you</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <h4 className="text-xl font-semibold mb-3 text-white">💎 Premium Experience</h4>
                  <p className="text-base text-white/80 leading-relaxed">Handpicked luxury products<br />Techniques that last & impress</p>
                </div>
              </div>
              <button className="bg-[#a76f52] hover:bg-[#b78362] text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Book Your Consultation →
              </button>
            </div>

            {/* IMAGE BLOCK */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="relative">
                <img 
                  src={architect} 
                  alt="Beauty Expert" 
                  className="w-full h-[600px] lg:h-[700px] object-cover rounded-3xl shadow-2xl transition-all duration-700 ease-in-out hover:scale-105" 
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mua;
