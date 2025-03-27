
import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle } from "lucide-react";

export function WhyChooseUsSection() {
  const benefits = [
    "Real-time package tracking updates",
    "Global coverage across 195+ countries",
    "User-friendly tracking interface",
    "Detailed shipping history",
    "Instant email & SMS notifications",
    "Secure and encrypted tracking data"
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-primary opacity-30 blur-xl"></div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                  alt="Delivery Expert" 
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -right-10 -bottom-10 hidden md:block">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs border border-gray-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      99%
                    </div>
                    <div>
                      <p className="font-medium">On-Time Delivery</p>
                      <p className="text-sm text-gray-500">Industry-leading performance</p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <p className="text-sm text-gray-600">Our network ensures your packages arrive on schedule, every time.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} className="order-1 lg:order-2">
            <span className="inline-block mb-3 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Why Choose TraceIt
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Superior Package Tracking You Can Trust
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're committed to providing the most reliable, transparent, and user-friendly tracking experience for your valuable shipments.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
