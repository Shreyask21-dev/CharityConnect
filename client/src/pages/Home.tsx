import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImpactCounter from "@/components/ImpactCounter";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DonationSection from "@/components/DonationSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Refs for scroll navigation
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const donateRef = useRef<HTMLDivElement>(null);
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Function to scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-gray-50 font-['Open_Sans'] text-gray-800 min-h-screen flex flex-col">
      <Header 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        projectsRef={projectsRef}
        galleryRef={galleryRef}
        testimonialsRef={testimonialsRef}
        donateRef={donateRef}
      />
      
      <main>
        <HeroSection scrollToSection={scrollToSection} donateRef={donateRef} aboutRef={aboutRef} />
        <ImpactCounter />
        <div ref={aboutRef}>
          <AboutSection />
        </div>
        <div ref={projectsRef}>
          <ProjectsSection scrollToSection={scrollToSection} donateRef={donateRef} />
        </div>
        <div ref={galleryRef}>
          <GallerySection />
        </div>
        <div ref={testimonialsRef}>
          <TestimonialsSection />
        </div>
        <div ref={donateRef}>
          <DonationSection />
        </div>
      </main>
      
      <Footer 
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        projectsRef={projectsRef}
        galleryRef={galleryRef}
        testimonialsRef={testimonialsRef}
        donateRef={donateRef}
      />
    </div>
  );
}
