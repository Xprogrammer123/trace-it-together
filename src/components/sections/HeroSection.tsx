
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { TrackingForm } from "@/components/TrackingForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 max-w-full overflow-hidden z-0 opacity-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-blue-50 blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6">
          <AnimatedSection delay={100} className="flex flex-col justify-center">
            <span className="inline-block mb-3 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              #1 Package Tracking Service
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Track Your Packages With <span className="text-gradient">Confidence</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 md:max-w-md">
              Real-time tracking that keeps you informed every step of the way. Never lose sight of your important deliveries again.
            </p>
            
            <div className="relative">
              <TrackingForm />
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/track">
                  <Button 
                    size="lg" 
                    className="group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Track a Package
                    <ArrowRight className={`ml-1 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    How It Works
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={300} className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl"></div>
              <div className="relative bg-white border border-gray-200 rounded-2xl p-1 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzl8fGRlbGl2ZXJ5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60" 
                  alt="Package Delivery" 
                  className="rounded-xl h-[400px] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -right-6 -bottom-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Package Delivered</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
