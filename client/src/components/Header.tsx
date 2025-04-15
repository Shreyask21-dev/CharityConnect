import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  aboutRef: React.RefObject<HTMLDivElement>;
  projectsRef: React.RefObject<HTMLDivElement>;
  galleryRef: React.RefObject<HTMLDivElement>;
  testimonialsRef: React.RefObject<HTMLDivElement>;
  donateRef: React.RefObject<HTMLDivElement>;
}

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
  aboutRef,
  projectsRef,
  galleryRef,
  testimonialsRef,
  donateRef
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#2C5282] text-2xl font-bold font-['Montserrat']">Hope Foundation</span>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          <button 
            onClick={() => scrollToSection(aboutRef)}
            className="text-gray-700 hover:text-[#2C5282] transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection(projectsRef)}
            className="text-gray-700 hover:text-[#2C5282] transition-colors"
          >
            Our Work
          </button>
          <button 
            onClick={() => scrollToSection(galleryRef)}
            className="text-gray-700 hover:text-[#2C5282] transition-colors"
          >
            Gallery
          </button>
          <button 
            onClick={() => scrollToSection(testimonialsRef)}
            className="text-gray-700 hover:text-[#2C5282] transition-colors"
          >
            Testimonials
          </button>
          <Button 
            onClick={() => scrollToSection(donateRef)}
            className="bg-[#F6AD55] hover:bg-[#ED8936] text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Donate Now
          </Button>
        </div>
        
        <button 
          className="md:hidden text-gray-700" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection(aboutRef)}
              className="text-gray-700 hover:text-[#2C5282] transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection(projectsRef)}
              className="text-gray-700 hover:text-[#2C5282] transition-colors"
            >
              Our Work
            </button>
            <button 
              onClick={() => scrollToSection(galleryRef)}
              className="text-gray-700 hover:text-[#2C5282] transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection(testimonialsRef)}
              className="text-gray-700 hover:text-[#2C5282] transition-colors"
            >
              Testimonials
            </button>
            <Button 
              onClick={() => scrollToSection(donateRef)}
              className="bg-[#F6AD55] hover:bg-[#ED8936] text-white px-6 py-2 rounded-full font-semibold transition-colors w-full"
            >
              Donate Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
