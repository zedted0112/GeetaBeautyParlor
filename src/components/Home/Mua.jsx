import React from "react";
import bgWhite from "/BG1.png";
import architect from "../../assets/mua.jpg";

const Mua = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#f9f4f0] to-[#eaddd2]">
      <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* TEXT BLOCK */}
        <div className="flex-1 max-w-xl">
          <div className="inline-block bg-[#eaddd2] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Expert Makeup Artist
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold mb-3 text-[#3b2f2f]">Meet Your Beauty Expert</h1>
          <p className="text-lg text-[#6b4f4f] mb-6">Crafting timeless elegance through artistry and care.</p>
          <p className="text-base leading-relaxed mb-8 text-[#3b2f2f]">
            With over 15 years in the beauty industry, our lead artist blends tradition with innovation to create personalized looks that celebrate your natural beauty. Whether it's for your big day or a special moment, each transformation is curated with luxury and love.<br/><br/>
            From intricate Indian bridal glam to chic contemporary styles — your look will be tailored, refined, and unforgettable.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#f9f5f3] rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold mb-2 text-[#3b2f2f]">🎨 Creative Vision</h4>
              <p className="text-sm text-[#6b4f4f]">Bespoke makeup artistry<br />Styles that reflect you</p>
            </div>
            <div className="bg-[#f9f5f3] rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold mb-2 text-[#3b2f2f]">💎 Premium Experience</h4>
              <p className="text-sm text-[#6b4f4f]">Handpicked luxury products<br />Techniques that last & impress</p>
            </div>
          </div>
          <button className="bg-[#a76f52] hover:bg-[#b78362] text-white text-base font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
            Book Your Consultation →
          </button>
        </div>

        {/* IMAGE BLOCK */}
        <div className="flex-1 max-w-lg rounded-3xl overflow-hidden shadow-lg">
          <img 
            src={architect} 
            alt="Beauty Expert" 
            className="w-full h-auto object-cover transition-all duration-700 ease-in-out hover:scale-105" 
          />
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
