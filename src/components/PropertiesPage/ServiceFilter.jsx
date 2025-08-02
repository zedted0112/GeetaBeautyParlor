import React, { useState } from 'react';

const ServiceFilter = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'bridal', label: 'Bridal Services' },
    { value: 'facial', label: 'Facial Treatments' },
    { value: 'hair', label: 'Hair Services' },
    { value: 'makeup', label: 'Makeup Services' },
    { value: 'hair-removal', label: 'Hair Removal' },
    { value: 'nail-care', label: 'Nail Care' },
    { value: 'mehendi', label: 'Mehendi Art' },
    { value: 'spa', label: 'Spa Treatments' }
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryChange(category.value)}
          className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 ${
            selectedCategory === category.value
              ? 'bg-[#a76f52] shadow-lg scale-105'
              : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default ServiceFilter; 