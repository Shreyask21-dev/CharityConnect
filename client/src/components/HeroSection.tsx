import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  donateRef: React.RefObject<HTMLDivElement>;
  aboutRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ scrollToSection, donateRef, aboutRef }: HeroSectionProps) {
  return (
    <section className="relative bg-[#2C5282] text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6">Together We Can Make A Difference</h1>
          <p className="text-lg md:text-xl mb-8">Join us in our mission to create a better future for those in need through sustainable support and community empowerment.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => scrollToSection(donateRef)} 
              className="bg-[#F6AD55] hover:bg-[#ED8936] text-white px-8 py-6 h-auto rounded-full font-semibold text-lg transition-colors"
            >
              Donate Now
            </Button>
            <Button 
              onClick={() => scrollToSection(aboutRef)} 
              variant="outline" 
              className="bg-white hover:bg-gray-100 text-[#2A4365] px-8 py-6 h-auto rounded-full font-semibold text-lg transition-colors"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
