
import { AnimatedSection } from "@/components/AnimatedSection";

export function PartnersSection() {
  const partners = [
    {
      name: "Logistics Pro",
      logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Global logistics solutions"
    },
    {
      name: "ShipFast",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Express delivery services"
    },
    {
      name: "TrackMaster",
      logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Advanced tracking technology"
    },
    {
      name: "SecureShip",
      logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Secure shipping solutions"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-600">
            We collaborate with industry leaders to provide the best tracking experience
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 100}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="h-36 flex items-center justify-center mb-4">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-24 object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">{partner.name}</h3>
              <p className="text-sm text-gray-600">{partner.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
