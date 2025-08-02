import React from "react";
import infoImage from "/Glamour.jpg";

const Info = () => {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${infoImage}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-gradient-to-b from-black/80 via-black/70 to-black/80">
        <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* TEXT BLOCK */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
              Your Beauty Journey
            </div>
            <h1 className="text-5xl lg:text-6xl font-semibold mb-6 text-white leading-tight">Geeta Makeovers</h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">Crafting timeless elegance through artistry and care.</p>
            <p className="text-lg leading-relaxed mb-10 text-white/90">
              Experience the magic of professional beauty transformation. Our expert team combines 
              traditional techniques with modern innovations to create stunning looks that enhance 
              your natural beauty and boost your confidence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <h4 className="text-xl font-semibold mb-3 text-white">🌟 Premium Experience</h4>
                <p className="text-base text-white/80 leading-relaxed">Luxury beauty services<br />Professional artistry</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <h4 className="text-xl font-semibold mb-3 text-white">💎 Expert Team</h4>
                <p className="text-base text-white/80 leading-relaxed">Handpicked professionals<br />Years of experience</p>
              </div>
            </div>
          </div>

          {/* CTA BLOCK */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20">
              <h3 className="text-3xl font-semibold text-white mb-6">
                Ready to Transform?
              </h3>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                Book your appointment today and discover the perfect look for your special occasion.
              </p>
              
              <div className="space-y-6 mb-8">
                <button className="w-full bg-[#a76f52] hover:bg-[#b78362] text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Book Appointment →
                </button>
                <button className="w-full border-2 border-white text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                  Experience Geeta Makeovers
                </button>
              </div>
              
              {/* Contact Info */}
              <div className="pt-8 border-t border-white/20">
                <div className="flex items-center justify-center space-x-8 text-white/70">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📞</div>
                    <p className="text-sm">Call Us</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📍</div>
                    <p className="text-sm">Visit Us</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="text-sm">Message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
