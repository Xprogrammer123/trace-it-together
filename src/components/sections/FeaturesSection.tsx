
import { AnimatedSection } from "@/components/AnimatedSection";
import { IconBadge } from "@/components/ui/IconBadge";
import { Globe, Clock, Bell, Shield, MapPin, Phone } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Global Coverage",
      description: "Track packages from anywhere in the world with our extensive international network.",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: "Real-Time Updates",
      description: "Receive instant updates about your package's location and status changes.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Delivery Notifications",
      description: "Get timely alerts when your package is out for delivery or has been delivered.",
      icon: <Bell className="h-6 w-6" />,
    },
    {
      title: "Secure Tracking",
      description: "Your tracking information is encrypted and protected with industry-leading security.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Location History",
      description: "View the complete journey of your package from sender to destination.",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      title: "24/7 Support",
      description: "Our customer service team is available around the clock to assist you.",
      icon: <Phone className="h-6 w-6" />,
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Comprehensive Tracking Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to keep track of your shipments with confidence and ease.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 100}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-primary/20 transition-colors"
            >
              <IconBadge 
                icon={feature.icon}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
