import React from "react";
import bgwhite2 from "/BG2.png";
import region1 from "../../assets/makeup.jpg";
import region2 from "../../assets/background15.jpg";
import region3 from "../../assets/bride3.jpg";

const Region = () => {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgwhite2}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-white/95 backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block bg-[#eaddd2] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              Our Service Categories
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl lg:text-5xl font-semibold mb-3 text-[#3b2f2f]">Styled by Expertise</h1>
            <p className="text-lg text-[#6b4f4f] mb-8 max-w-2xl mx-auto">
              Discover our specialized beauty services designed to enhance your natural beauty 
              and create stunning transformations for every occasion.
            </p>
            
            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Glam & Beauty */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region1}
                    alt="Glam & Beauty Services"
                    className="w-full h-[400px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Glam & Beauty
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        Professional makeup and beauty services
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">86 Services</span>
                        <button className="bg-white text-[#3b2f2f] px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cut & Curls */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region2}
                    alt="Cut & Curls Services"
                    className="w-full h-[400px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Cut & Curls
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        Expert hairstyling and hair care services
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">54 Services</span>
                        <button className="bg-white text-[#3b2f2f] px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bridal Grace */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region3}
                    alt="Bridal Grace Services"
                    className="w-full h-[400px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Bridal Grace
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        Complete bridal makeup and styling packages
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">97 Packages</span>
                        <button className="bg-white text-[#3b2f2f] px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <button className="bg-[#a76f52] hover:bg-[#b78362] text-white text-base font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              View All Services →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Region;
