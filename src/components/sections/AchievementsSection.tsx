
import { AnimatedSection } from "@/components/AnimatedSection";
import { Award, Clock, TrendingUp, Users } from "lucide-react";

export function AchievementsSection() {
  const achievements = [
    {
      title: "Industry Recognition",
      description: "Named 'Top Tracking Provider' by Logistics Weekly for 3 consecutive years",
      icon: <Award className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Tracking Speed",
      description: "Average response time reduced to under 200ms for all tracking requests",
      icon: <Clock className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Global Growth",
      description: "Expanded operations to 35 new countries in the last 18 months",
      icon: <TrendingUp className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Customer Base",
      description: "Serving over 1,200 enterprise clients and 3M+ end users globally",
      icon: <Users className="h-8 w-8" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Key Achievements
          </h2>
          <p className="text-lg text-gray-300">
            Milestones that define our commitment to excellence
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, index) => (
            <AnimatedSection 
              key={index} 
              delay={index * 100}
              className="relative overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-20"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg w-fit mb-4">
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-200 mt-auto">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
