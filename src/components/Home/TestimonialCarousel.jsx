import React from 'react';

const testimonials = [
  {
    name: 'Rama Krishna Jetti',
    message:
      '99designs takes an unconventional approach to its testimonial page. Using a star-rating system not usually seen in the B2B sector...',
    image: '/rama.jpg',
  },
  {
    name: 'Chandaka Bhaskar Surya Prakesh Rao',
    message:
      'The placeholder text, beginning with the line “Lorem ipsum dolor sit amet, consectetur adipiscing elit”, looks like Latin because...',
    image: '/chandaka.jpg',
  },
  {
    name: 'Vara Prasad Suravrapu',
    message:
      "Each review features a quote that summarizes how Slack helped the customer's business...",
    image: '/vara.jpg',
  },
];

const TestimonialCarousel = () => {
  return (
    <div className="relative py-16 overflow-hidden bg-gradient-to-r from-[#ECFBF3] via-[#DFF4FF] to-[#ECFBF3] animate-gradient-x">
      <div className="container mx-auto">
        <h2 className="text-center mb-10 text-4xl font-bold text-[#567D46]">
          What Our Clients Say
        </h2>

        <div
          id="testimonialCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div className="carousel-inner">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <div className="flex justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition duration-500 text-center py-10 px-8 w-full max-w-2xl">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="mx-auto rounded-full mb-6 border-4 border-green-400 shadow-md"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                    <h5 className="text-xl font-bold mb-3 text-[#017DB9]">{t.name}</h5>
                    <p className="text-gray-700 text-md px-4">{t.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional: Uncomment below for prev/next buttons */}
          {/* 
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button> 
          */}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
