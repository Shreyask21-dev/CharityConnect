export default function GallerySection() {
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1536144673493-695c255e4d6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Community Event",
      description: "Bringing joy to children through education and play"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "School Construction",
      description: "Building educational foundations for future generations"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Medical Outreach",
      description: "Providing healthcare to remote communities"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1617893521598-97e137cf0bfb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Women Empowerment",
      description: "Skill development workshops for sustainable livelihoods"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Clean Water Project",
      description: "Bringing safe drinking water to villages"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Food Distribution",
      description: "Emergency relief during natural disasters"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Community Gardens",
      description: "Sustainable food sources for villages"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Our Volunteers",
      description: "The heart of our organization"
    }
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-gray-800 mb-4">Our Impact in Pictures</h2>
          <div className="w-20 h-1 bg-[#38A169] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">See the difference your donations make in communities around the world.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map(image => (
            <div key={image.id} className="relative overflow-hidden rounded-lg group">
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h4 className="font-semibold">{image.title}</h4>
                  <p className="text-sm">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
