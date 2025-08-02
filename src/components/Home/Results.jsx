import React from "react";
import resultsHero from "/hero-home.jpg";

const Results = () => {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${resultsHero}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full bg-gradient-to-b from-black/80 via-black/70 to-black/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-12">
            {/* Badge */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                Our Success Story
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Proven
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-2">
                Results
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              Our commitment to excellence has earned us the trust of thousands of clients. 
              Every transformation tells a story of beauty, confidence, and satisfaction.
            </p>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 pt-12">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    800+
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                    Services Rendered
                  </h3>
                  <p className="text-white/70 text-sm">
                    Professional beauty services delivered with excellence
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    1500+
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                    Satisfied Clients
                  </h3>
                  <p className="text-white/70 text-sm">
                    Happy customers who trust us with their beauty
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    97%
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                    Customer Satisfaction
                  </h3>
                  <p className="text-white/70 text-sm">
                    Exceptional service quality and client happiness
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="pt-12">
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join Our Happy Clients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
