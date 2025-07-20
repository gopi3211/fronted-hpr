import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Home/Navbar';
import HeroCarousel from './components/Home/HeroCarousel';
import MissionStatement from './components/Home/MissionStatement';
import ProjectsSection from './components/Home/ProjectsSection';
import CompanyValuesSection from './components/Home/CompanyValuesSection';
import TestimonialCarousel from './components/Home/TestimonialCarousel';
import Footer from './components/Home/Footer';

import HeroCarouselCrud from './components/Admin/HomeSectionCrud/HeroCarouselCrud';
import MissionStatementCrud from './components/Admin/HomeSectionCrud/MissionStatementCrud';
import ProjectsSectionCrud from './components/Admin/HomeSectionCrud/ProjectsSectionCrud';

import AdminLoginPage from './components/Admin/AdminLoginPage';
import AdminRegisterPage from './components/Admin/AdminRegisterPage';
import AdminVerifyOtpPage from './components/Admin/AdminVerifyOtpPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';


import CompanyValuesCrud from './components/Admin/HomeSectionCrud/CompanyValuesCrud';
import TestimonialsCrud from './components/Admin/HomeSectionCrud/TestimonialsCrud';

import FooterCrud from './components/Admin/HomeSectionCrud/FooterCrud';
import AboutUsPage from './components/AboutUs/AboutUsPage';

import AboutUsPageCrud from './components/Admin/HomeSectionCrud/AboutUsPageCrud';
import AboutUsSubsectionCrud from './components/Admin/HomeSectionCrud/AboutUsSubsectionCrud';
import PartnersCrud from './components/Admin/HomeSectionCrud/PartnersCrud';

// // Optional placeholders
// const AboutUsSection = () => (
//   <div className="text-center py-20 bg-white" id="about-us">
//     <h2 className="text-3xl font-bold text-lime-700">About Us Section (Coming Soon)</h2>
//   </div>
// );

// const NewsSection = () => (
//   <div className="text-center py-20 bg-white" id="news-updates">
//     <h2 className="text-3xl font-bold text-lime-700">News & Updates (Coming Soon)</h2>
//   </div>
// );

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('adminToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <Navbar />
      
<div className="pt-24"> {/* Add this wrapper */}

      <Routes>




        {/* 🌐 Public Home Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen w-full overflow-x-hidden pt-24">
              <HeroCarousel />
              <MissionStatement />
              <div id="projects">
                <ProjectsSection />
              </div>
              <CompanyValuesSection />
              <TestimonialCarousel />
              {/* Future sections:
              <div id="about-us">
                <AboutUsSection />
              </div>
              <div id="news-updates">
                <NewsSection />
              </div> */}
              <Footer />
            </div>
          }
        />

  <Route path="/about" element={<AboutUsPage />} />



        {/* 🔐 Auth Pages (Only when NOT logged in) */}
        {!isAuthenticated && (
          <>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/admin/verify-otp" element={<AdminVerifyOtpPage />} />
          </>
        )}

       
       
        {/* 🛠️ Admin CRUD Section (Protected) */}
        <Route
          path="/admin/home/crud"
          element={
            <ProtectedRoute>
              <div className="bg-white min-h-screen px-6 py-10 space-y-16">
                <HeroCarouselCrud />
                <MissionStatementCrud />
                <ProjectsSectionCrud />
                        <CompanyValuesCrud /> {/* ✅ Add here */}
<TestimonialsCrud />
<FooterCrud /> {/* ✅ Add this */}

              </div>
            </ProtectedRoute>
          }
        />


       {/* ✅ About Us CRUD Protected Route */}
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <AboutUsPageCrud />
            </ProtectedRoute>
          }
        />







        {/* 📊 Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


<Route
  path="/admin/about/subsections"
  element={
    <ProtectedRoute>
      <AboutUsSubsectionCrud />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/partners"
  element={
    <ProtectedRoute>
      <PartnersCrud />
    </ProtectedRoute>
  }
/>




      </Routes>






</div>


    </>
  );
}

export default App;
