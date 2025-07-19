import React from 'react';

const projectData = [
  {
    title: 'Ongoing Projects',
    description:
      'At HPR Infra, innovation meets excellence. We craft future-ready communities with quality, sustainability, and elegant design.',
    img: '/ongoing.jpg',
    color: 'from-white to-[#E1F0DA]',
  },
  {
    title: 'Completed Projects',
    description:
      'Explore our legacy of achievements—successful plot layouts to signature apartments. HPR Infra builds not just structures, but thriving communities.',
    img: '/completed.jpg',
    color: 'from-white to-[#E6F4F1]',
  },
  {
    title: 'Future Projects',
    description:
      'Our vision redefines the future of real estate. We blend smart tech, sustainability, and lifestyle innovation to create what comes next.',
    img: '/future.jpg',
    color: 'from-white to-[#F3F0FF]',
  },
];

const ProjectsSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#e9f0ea] to-white py-20 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-5xl font-extrabold text-center text-[#4E7938] mb-16 tracking-wide">
          Our Projects
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {projectData.map((project, index) => (
            <div
              key={index}
              className={`bg-gradient-to-b ${project.color} rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition duration-300 ease-in-out`}
            >
              <img
                src={project.img}
                alt={project.title}
                className="rounded-t-2xl w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#23424A] mb-4">{project.title}</h3>
                <p className="text-[16px] leading-relaxed text-gray-800 mb-6">
                  {project.description}
                </p>
                <a
                  href="#"
                  className="text-green-700 font-semibold hover:underline inline-block"
                >
                  Continue →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
