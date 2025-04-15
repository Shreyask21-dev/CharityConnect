import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

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
  const { user, logoutMutation } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Render auth links based on user state
  const renderAuthLinks = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <Link href={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}>
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <Link href="/auth">
            <Button variant="ghost" className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="ghost" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Register
            </Button>
          </Link>
        </div>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-[#2C5282] text-2xl font-bold font-['Montserrat'] cursor-pointer">Hope Foundation</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-4 items-center">
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
          
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          
          {renderAuthLinks()}
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
            
            <div className="border-t border-gray-200 my-2 pt-2"></div>
            
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="ghost" className="w-full justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
