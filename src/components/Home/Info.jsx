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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content Section */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
                <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                  Your Beauty Journey
                </p>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Geeta
                <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2">
                  Makeovers
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Experience the magic of professional beauty transformation. Our expert team combines 
                traditional techniques with modern innovations to create stunning looks that enhance 
                your natural beauty and boost your confidence.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl mb-2">🌟</div>
                  <h3 className="font-semibold text-white">Premium Experience</h3>
                  <p className="text-sm text-white/80">Luxury beauty services</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl mb-2">💎</div>
                  <h3 className="font-semibold text-white">Expert Team</h3>
                  <p className="text-sm text-white/80">Professional artists</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform?
                </h3>
                <p className="text-white/80 mb-6">
                  Book your appointment today and discover the perfect look for your special occasion.
                </p>
                
                <div className="space-y-4">
                  <button className="w-full bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Book Appointment
                  </button>
                  <button className="w-full border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                    Experience Geeta Makeovers
                  </button>
                </div>
                
                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-6 text-white/70">
                    <div className="text-center">
                      <div className="text-xl mb-1">📞</div>
                      <p className="text-sm">Call Us</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl mb-1">📍</div>
                      <p className="text-sm">Visit Us</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl mb-1">💬</div>
                      <p className="text-sm">Message</p>
                    </div>
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
