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
        <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <p className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                Our Success Story
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-semibold mb-6 text-white leading-tight">Proven Results</h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence has earned us the trust of thousands of clients. 
              Every transformation tells a story of beauty, confidence, and satisfaction.
            </p>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl lg:text-6xl font-semibold text-white mb-4 group-hover:text-[#a76f52] transition-colors duration-300">
                    800+
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Services Rendered
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    Professional beauty services delivered with excellence
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl lg:text-6xl font-semibold text-white mb-4 group-hover:text-[#a76f52] transition-colors duration-300">
                    1500+
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Satisfied Clients
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    Happy customers who trust us with their beauty
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-5xl lg:text-6xl font-semibold text-white mb-4 group-hover:text-[#a76f52] transition-colors duration-300">
                    97%
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Customer Satisfaction
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    Exceptional service quality and client happiness
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <button className="bg-[#a76f52] hover:bg-[#b78362] text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Join Our Happy Clients →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
