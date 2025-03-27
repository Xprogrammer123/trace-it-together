
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      question: "How do I track my package?",
      answer: "Simply enter your tracking number in the search bar on our homepage or tracking page. Our system will instantly display the current status and location of your package."
    },
    {
      question: "Which carriers do you support?",
      answer: "We support all major carriers including USPS, FedEx, UPS, DHL, and many international postal services. Our system is compatible with most tracking number formats."
    },
    {
      question: "How accurate is your tracking information?",
      answer: "Our tracking data is updated in real-time from carrier APIs, providing the most accurate and current information available about your package's status and location."
    },
    {
      question: "Can I track international shipments?",
      answer: "Yes, our platform supports international tracking across 195+ countries. We integrate with global carriers and postal services to provide worldwide coverage."
    },
    {
      question: "Do I need to create an account to track packages?",
      answer: "No, you can track packages without creating an account. However, creating an account allows you to save tracking numbers, receive notifications, and access delivery history."
    },
    {
      question: "How do I receive delivery notifications?",
      answer: "After entering your tracking number, you can opt-in for email or SMS notifications. If you have an account, you can manage notification preferences in your profile settings."
    }
  ];

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our package tracking service.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AnimatedSection
              key={index}
              delay={index * 100}
              className="mb-4"
            >
              <Card className={`cursor-pointer border ${expandedFAQ === index ? 'border-primary/50 shadow-md' : 'border-gray-200'}`}>
                <CardHeader 
                  className="py-4 px-6"
                  onClick={() => toggleFAQ(index)}
                >
                  <CardTitle className="text-lg font-medium flex justify-between items-center">
                    {faq.question}
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                    />
                  </CardTitle>
                </CardHeader>
                {expandedFAQ === index && (
                  <CardContent className="pt-0 px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
