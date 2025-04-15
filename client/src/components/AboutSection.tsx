import { BookOpen, Heart, Home, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-gray-800 mb-4">Our Mission</h2>
          <div className="w-20 h-1 bg-[#38A169] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">Hope Foundation is dedicated to creating sustainable change through education, healthcare, and community development initiatives. We believe in empowering communities to build their own future.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Children in a classroom" 
              className="rounded-lg shadow-lg w-full h-auto object-cover" 
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-['Montserrat'] text-gray-800 mb-4">Why We Exist</h3>
            <p className="text-gray-600 mb-6">Founded in 2010, Hope Foundation was born from a simple idea: everyone deserves access to basic necessities and opportunities regardless of their circumstances.</p>
            <p className="text-gray-600 mb-6">Our work spans across multiple areas including education for underprivileged children, healthcare access in remote communities, and sustainable development initiatives that help communities become self-sufficient.</p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start">
                <div className="bg-[#EBF8FF] p-3 rounded-full mr-4">
                  <BookOpen className="h-5 w-5 text-[#2C5282]" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Education</h4>
                  <p className="text-sm text-gray-600">Building schools and providing quality education</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#EBF8FF] p-3 rounded-full mr-4">
                  <Heart className="h-5 w-5 text-[#2C5282]" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Healthcare</h4>
                  <p className="text-sm text-gray-600">Medical camps and health education</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#EBF8FF] p-3 rounded-full mr-4">
                  <Home className="h-5 w-5 text-[#2C5282]" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Shelter</h4>
                  <p className="text-sm text-gray-600">Housing projects for displaced families</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#EBF8FF] p-3 rounded-full mr-4">
                  <Users className="h-5 w-5 text-[#2C5282]" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Community</h4>
                  <p className="text-sm text-gray-600">Building sustainable communities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
