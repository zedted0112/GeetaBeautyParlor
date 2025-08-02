import React, { useState } from "react";
import Header from "../Header";
import ServiceFilter from "./ServiceFilter";
import { beautyServices } from "./beautyServices";
import { teamImages } from '../../utils/imageImports';
import { Link } from "react-router-dom";

const infoImage = teamImages.member4;

const AllProperties = () => {
  const [filteredServices, setFilteredServices] = useState(beautyServices);

  const handleFilterChange = (category) => {
    if (category === 'all') {
      setFilteredServices(beautyServices);
    } else {
      const filtered = beautyServices.filter(service => service.category === category);
      setFilteredServices(filtered);
    }
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url('${infoImage}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        objectFit: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-full bg-[#32210DB2]">
        <Header transparent={false} />

        <div className="w-[80%] h-full mx-auto max-w-[1200px] py-28">
          <h1 className="text-[50px] text-center pb-4 text-white leading-[57.6px] tracking-[-1.26px]">
            Unveiling the Essence of <br /> Glamour Palette Beauty Services
          </h1>
          <h2 className="text-[20px] text-center my-10 text-white leading-[24px] md:w-[65%] mx-auto">
            Indulge in our array of bespoke beauty services at Glamour Palette.
            From personalized skincare to flawless makeup, our team is committed
            to enhancing your natural beauty and leaving you feeling confident
            and rejuvenated.
          </h2>
          <ServiceFilter onFilterChange={handleFilterChange} />
          <div className="grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 gap-x-12 gap-y-8">
            {filteredServices.map((service) => (
              <Link to={`/property/${service.id}`} key={service.id}>
                <div
                  key={service.id}
                  className="flex flex-col shadow-2xl  transition-all duration-700 ease-in-out  hover:scale-105   rounded-[32px]"
                >
                  <img
                    src={service.images[0]}
                    alt="service thumbnail"
                    className="w-full h-52 object-cover rounded-t-[30px] brightness-50"
                  />
                  <div className="bg-[#efece899] rounded-b-[35px] p-8">
                    <h3 className="text-black text-[20px] leading-[27.65px] tracking-[-0.6px] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2">{service.description}</p>
                    <p className="text-[#a76f52] font-semibold">{service.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProperties;
