import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProjectsSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  donateRef: React.RefObject<HTMLDivElement>;
}

export default function ProjectsSection({ scrollToSection, donateRef }: ProjectsSectionProps) {
  const projects = [
    {
      id: 1,
      title: "Education for All",
      description: "Providing quality education to children in underserved rural communities through infrastructure development and teacher training.",
      progress: 75,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Healthcare Access",
      description: "Bringing essential medical services to remote villages through mobile clinics and training local healthcare workers.",
      progress: 60,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Clean Water Initiative",
      description: "Building sustainable water infrastructure and teaching proper sanitation practices to prevent water-borne diseases.",
      progress: 85,
      image: "https://images.unsplash.com/photo-1541802645635-11f2286a7482?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section id="projects" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-gray-800 mb-4">Our Projects</h2>
          <div className="w-20 h-1 bg-[#38A169] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">See how your donations create real change in communities around the world. Here are some of our current and recent initiatives.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">Progress</span>
                    <span>{project.progress}% Complete</span>
                  </div>
                  <Progress value={project.progress} className="h-2.5 bg-gray-200 rounded-full" />
                </div>
                <Button 
                  onClick={() => scrollToSection(donateRef)} 
                  variant="link" 
                  className="text-[#2C5282] font-semibold hover:text-[#1A365D] p-0 h-auto flex items-center"
                >
                  Support This Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
