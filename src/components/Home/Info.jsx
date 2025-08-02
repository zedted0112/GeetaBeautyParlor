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
        <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
          {/* TEXT BLOCK */}
          <div className="flex-1 max-w-xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Your Beauty Journey
            </div>
            <h1 className="text-4xl lg:text-5xl font-semibold mb-3 text-white">Geeta Makeovers</h1>
            <p className="text-lg text-white/80 mb-6">Crafting timeless elegance through artistry and care.</p>
            <p className="text-base leading-relaxed mb-8 text-white/90">
              Experience the magic of professional beauty transformation. Our expert team combines 
              traditional techniques with modern innovations to create stunning looks that enhance 
              your natural beauty and boost your confidence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <h4 className="text-lg font-semibold mb-2 text-white">🌟 Premium Experience</h4>
                <p className="text-sm text-white/80">Luxury beauty services<br />Professional artistry</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <h4 className="text-lg font-semibold mb-2 text-white">💎 Expert Team</h4>
                <p className="text-sm text-white/80">Handpicked professionals<br />Years of experience</p>
              </div>
            </div>
          </div>

          {/* CTA BLOCK */}
          <div className="flex-1 max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Ready to Transform?
              </h3>
              <p className="text-white/80 mb-6">
                Book your appointment today and discover the perfect look for your special occasion.
              </p>
              
              <div className="space-y-4 mb-6">
                <button className="w-full bg-[#a76f52] hover:bg-[#b78362] text-white text-base font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                  Book Appointment →
                </button>
                <button className="w-full border-2 border-white text-white text-base font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                  Experience Geeta Makeovers
                </button>
              </div>
              
              {/* Contact Info */}
              <div className="pt-6 border-t border-white/20">
                <div className="flex items-center justify-center space-x-6 text-white/70">
                  <div className="text-center">
                    <div className="text-lg mb-1">📞</div>
                    <p className="text-xs">Call Us</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg mb-1">📍</div>
                    <p className="text-xs">Visit Us</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg mb-1">💬</div>
                    <p className="text-xs">Message</p>
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
