
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alexandra Chen",
      position: "E-commerce Owner",
      company: "StyleHub",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      content: "TraceIt has revolutionized how we handle shipment tracking for our customers. The real-time updates and transparent delivery information have significantly reduced customer inquiries about order status.",
      rating: 5
    },
    {
      name: "Michael Daves",
      position: "Logistics Manager",
      company: "FastFreight Inc",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      content: "The TraceIt platform has streamlined our package tracking workflow and improved our delivery transparency. Our clients love being able to see exactly where their shipments are at any given moment.",
      rating: 5
    },
    {
      name: "Sophia Rodriguez",
      position: "Operations Director",
      company: "Global Goods",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      content: "We've tried several tracking solutions, but TraceIt stands out with its accuracy and ease of use. The detailed shipping history and notifications have been game-changers for our international deliveries.",
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by businesses and individuals worldwide for reliable package tracking.
          </p>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <AnimatedSection className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full object-cover"
                        loading="lazy"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                            />
                          ))}
                        </div>
                        
                        <blockquote className="text-lg text-gray-700 mb-4 italic">
                          "{testimonial.content}"
                        </blockquote>
                        
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                          <span className="text-sm text-gray-500">{testimonial.position}, {testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial} 
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
