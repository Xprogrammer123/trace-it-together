
import { AnimatedSection } from "@/components/AnimatedSection";

export function TechnologiesSection() {
  const technologies = [
    {
      name: "GPS Tracking",
      icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Real-time location tracking with centimeter-level accuracy"
    },
    {
      name: "IoT Sensors",
      icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Environmental monitoring for temperature-sensitive shipments"
    },
    {
      name: "Blockchain",
      icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Immutable records for secure supply chain verification"
    },
    {
      name: "AI Predictions",
      icon: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      description: "Intelligent delivery time predictions based on historical data"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Advanced Tracking Technologies
          </h2>
          <p className="text-lg text-gray-600">
            Cutting-edge technologies that power our tracking platform
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 100}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
