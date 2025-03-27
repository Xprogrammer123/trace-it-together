
import { AnimatedSection } from "@/components/AnimatedSection";
import { TruckIcon, ClockIcon, MapIcon, UsersIcon } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: <TruckIcon className="h-6 w-6" />,
      value: "99.8%",
      label: "Delivery Rate",
      description: "Packages safely delivered to their destination"
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      value: "150K+",
      label: "Daily Trackings",
      description: "Active users tracking their packages daily"
    },
    {
      icon: <MapIcon className="h-6 w-6" />,
      value: "195",
      label: "Countries",
      description: "Global coverage across continents"
    },
    {
      icon: <UsersIcon className="h-6 w-6" />,
      value: "500K+",
      label: "Happy Users",
      description: "Customers satisfied with our service"
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedSection 
              key={index}
              delay={index * 100}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-primary mb-1">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
