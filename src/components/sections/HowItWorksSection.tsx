
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { IconBadge } from "@/components/ui/IconBadge";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Enter Tracking Number",
      description: "Input your unique tracking code in our search bar to begin tracking your package.",
      icon: <span className="text-xl font-medium">1</span>
    },
    {
      number: "02",
      title: "View Detailed Status",
      description: "Get real-time updates on your package's location, estimated delivery time, and status.",
      icon: <span className="text-xl font-medium">2</span>
    },
    {
      number: "03",
      title: "Receive Notifications",
      description: "Opt-in for email or SMS alerts to stay informed about important delivery updates.",
      icon: <span className="text-xl font-medium">3</span>
    },
    {
      number: "04",
      title: "Delivery Confirmation",
      description: "Get confirmation when your package has been successfully delivered to its destination.",
      icon: <span className="text-xl font-medium">4</span>
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How Package Tracking Works
          </h2>
          <p className="text-lg text-gray-600">
            Track your deliveries in real-time with our simple, four-step tracking process.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 150}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <IconBadge 
                  icon={step.icon}
                  className="mb-5"
                />
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 text-gray-300">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
