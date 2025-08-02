import React from "react";
import { serviceImages } from '../../utils/imageImports';
const bridalImage = serviceImages.bridal.main6;import Header from "../Header";

const ContactHero = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden"     style={{ 
      backgroundImage: `url('${heroImageContact}')`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center 25%",
    }}>
      <div className="w-full min-h-screen bg-gradient-to-b from-black/60 via-black/40 to-black/70">
        <Header transparent={true} />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Tagline */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                Get In Touch
              </p>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Begin Your Beauty
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-2">
                Transformation
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light">
              Ready to elevate your beauty experience? Our team at Geeta Makeovers is here to accompany 
              you through every step of your beauty journey. Reach out now and let's bring your beauty dreams to life.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Book Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                Call Now
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="flex justify-center items-center space-x-8 pt-12 text-white/70">
              <div className="text-center">
                <p className="text-2xl font-bold">📞</p>
                <p className="text-sm">Call Us</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold">📍</p>
                <p className="text-sm">Visit Us</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold">💬</p>
                <p className="text-sm">Message Us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ContactHero;
