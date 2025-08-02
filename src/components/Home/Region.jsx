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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-12">
            {/* Badge */}
            <div className="inline-block bg-[#937D64]/20 backdrop-blur-sm rounded-full px-6 py-2 border border-[#937D64]/30">
              <p className="text-[#937D64] text-sm font-medium tracking-wide uppercase">
                Our Service Categories
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1E1E] leading-tight tracking-tight">
              Styled by
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2 text-[#937D64]">
                Expertise
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-[#1E1E1E]/80 leading-relaxed max-w-4xl mx-auto">
              Discover our specialized beauty services designed to enhance your natural beauty 
              and create stunning transformations for every occasion.
            </p>
            
            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 pt-12">
              {/* Glam & Beauty */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region1}
                    alt="Glam & Beauty Services"
                    className="w-full h-[500px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Glam & Beauty
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        Professional makeup and beauty services
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">86 Services</span>
                        <button className="bg-white text-[#1E1E1E] px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cut & Curls */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region2}
                    alt="Cut & Curls Services"
                    className="w-full h-[500px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Cut & Curls
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        Expert hairstyling and hair care services
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">54 Services</span>
                        <button className="bg-white text-[#1E1E1E] px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bridal Grace */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ease-in-out hover:scale-105">
                  <img
                    src={region3}
                    alt="Bridal Grace Services"
                    className="w-full h-[500px] object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Bridal Grace
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        Complete bridal makeup and styling packages
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">97 Packages</span>
                        <button className="bg-white text-[#1E1E1E] px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300">
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="pt-12">
              <button className="bg-[#937D64] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8B7355] transition-all duration-300 transform hover:scale-105 shadow-lg">
                View All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Region;
