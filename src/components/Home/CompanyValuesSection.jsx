import React from 'react';

const values = [
  {
    title: 'Our Culture',
    description:
      'At HPR Infra, our culture is not just a reflection of who we are today, but a compass guiding us towards an inspiring future.',
    leftImage: '/proof-culture.jpg',
  },
  {
    title: 'Professional Service',
    description:
      'Our in-house team ensures best-in-class construction, delivered by experienced experts for complete execution.',
    leftImage: '/proof-service.jpg',
  },
  {
    title: 'Quality Assurance',
    description:
      'Be ensured that with us, you have the right quality for the right price — no overcharging or compromise.',
    leftImage: '/proof-quality.jpg',
  },
  {
    title: '100% Transparency',
    description:
      'Every detail is shared transparently. No hidden charges. We build with honesty as our core.',
    leftImage: '/proof-transparency.jpg',
  },
  {
    title: 'Insured Work',
    description:
      'Your structure is insured with us. For any issues post-handover, we’ve got your back.',
    leftImage: '/proof-insured.jpg',
  },
  {
    title: 'Future Driven',
    description:
      'We constantly innovate and evolve to meet the needs of the modern world. We don’t just build today — we prepare for tomorrow.',
    leftImage: '/proof-culture.jpg',
  }
];

const CompanyValuesSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#f9f9f9] to-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#567D46] mb-16">
          Why Choose HPR Infra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {values.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              } bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden`}
            >
              <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                  src={item.leftImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 w-full flex flex-col justify-center p-8 text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#23424A] mb-4">{item.title}</h3>
                <p className="text-lg leading-relaxed text-gray-800">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyValuesSection;
