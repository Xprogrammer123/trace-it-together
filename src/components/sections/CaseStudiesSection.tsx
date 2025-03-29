
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

export function CaseStudiesSection() {
  const caseStudies = [
    {
      title: "Global E-Commerce Tracking Solution",
      description: "How we helped an international retailer track 250,000+ packages monthly across 45 countries",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "E-Commerce"
    },
    {
      title: "Healthcare Supply Chain Management",
      description: "Implementing real-time tracking for critical medical supplies with temperature monitoring",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Healthcare"
    },
    {
      title: "Manufacturing Parts Logistics",
      description: "Optimizing just-in-time delivery for automotive manufacturing with precise tracking",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Manufacturing"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium text-primary rounded-full bg-primary/10 mb-3">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Success Stories From Our Clients
          </h2>
          <p className="text-lg text-gray-600">
            See how our tracking solutions have transformed businesses across industries
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 150}
              className="group overflow-hidden rounded-xl border border-gray-200 hover:border-primary/30 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 z-10"></div>
                <img 
                  src={study.image} 
                  alt={study.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 z-20 text-xs font-medium bg-white px-2 py-1 rounded-md text-gray-800">
                  {study.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {study.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {study.description}
                </p>
                <Button variant="ghost" className="p-0 group" size="sm">
                  <span className="flex items-center text-primary">
                    Read case study 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
