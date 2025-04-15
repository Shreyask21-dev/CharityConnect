export default function ImpactCounter() {
  return (
    <section className="bg-white py-12 shadow-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="text-4xl font-bold text-[#2C5282] mb-2">10,542</div>
            <p className="text-gray-600 text-lg">People Helped</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-[#2C5282] mb-2">75</div>
            <p className="text-gray-600 text-lg">Projects Completed</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-[#2C5282] mb-2">32</div>
            <p className="text-gray-600 text-lg">Communities Supported</p>
          </div>
        </div>
      </div>
    </section>
  );
}
