import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Volunteer since 2018",
      text: "Working with Hope Foundation has been one of the most rewarding experiences of my life. Seeing the direct impact of our work on communities has changed my perspective forever.",
      image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Community Leader",
      text: "The clean water project has transformed our village. Children no longer fall sick from water-borne diseases, and women don't have to walk miles for water anymore. We are forever grateful.",
      image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Maya Patel",
      role: "Scholarship Recipient",
      text: "Thanks to the scholarship from Hope Foundation, I was able to continue my education and become the first in my family to attend college. Now I'm studying to become a doctor to help my community.",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Monthly Donor",
      text: "I've been donating monthly for over 5 years now, and the transparency Hope Foundation provides about where my money goes is incredible. I can see the real impact of every rupee I donate.",
      image: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#2C5282] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] mb-4">Voices of Change</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-lg opacity-90">Hear from those who've experienced the impact of your generosity firsthand.</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white/50" 
                      />
                      <div>
                        <div className="text-[#F6AD55] mb-4 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="fill-current h-5 w-5" />
                          ))}
                        </div>
                        <p className="text-lg italic mb-6">"{testimonial.text}"</p>
                        <div>
                          <h4 className="font-bold text-xl">{testimonial.name}</h4>
                          <p className="opacity-75">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full focus:outline-none" 
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full focus:outline-none" 
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full ${
                  index === currentSlide ? "bg-white/50" : "bg-white/30"
                } cursor-pointer`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
