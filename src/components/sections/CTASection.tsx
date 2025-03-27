
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-primary text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Track Your Package?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-md">
              Enter your tracking number to get started or create an account to manage all your shipments in one place.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/track">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90 border-white"
                >
                  Track Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 border-white/20">
                  Create Account
                </Button>
              </Link>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={200} className="lg:text-right">
            <div className="relative">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                  alt="Tracking App" 
                  className="relative rounded-lg shadow-xl max-w-md mx-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
