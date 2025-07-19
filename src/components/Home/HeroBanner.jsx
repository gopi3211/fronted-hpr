import React from 'react';

const HeroBanner = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <img
        src="/hero.jpg"
        alt="hero background"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
          Welcome to HPR Infra
        </h1>
        <p className="text-white mt-4 text-lg md:text-2xl max-w-2xl">
          Your trusted real estate partner in Hyderabad
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;
