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
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-6">
              <p className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                Our Success Story
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl lg:text-5xl font-semibold mb-3 text-white">Proven Results</h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Our commitment to excellence has earned us the trust of thousands of clients. 
              Every transformation tells a story of beauty, confidence, and satisfaction.
            </p>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl lg:text-5xl font-semibold text-white mb-2 group-hover:text-[#a76f52] transition-colors duration-300">
                    800+
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Services Rendered
                  </h3>
                  <p className="text-sm text-white/70">
                    Professional beauty services delivered with excellence
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl lg:text-5xl font-semibold text-white mb-2 group-hover:text-[#a76f52] transition-colors duration-300">
                    1500+
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Satisfied Clients
                  </h3>
                  <p className="text-sm text-white/70">
                    Happy customers who trust us with their beauty
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl lg:text-5xl font-semibold text-white mb-2 group-hover:text-[#a76f52] transition-colors duration-300">
                    97%
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Customer Satisfaction
                  </h3>
                  <p className="text-sm text-white/70">
                    Exceptional service quality and client happiness
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <button className="bg-[#a76f52] hover:bg-[#b78362] text-white text-base font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Join Our Happy Clients →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
