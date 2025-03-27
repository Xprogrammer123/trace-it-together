
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function FooterSection() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-gray-50 pt-20 pb-8" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-display font-semibold">TraceIt</span>
            </div>
            
            <p className="text-gray-600 mb-8 max-w-md">
              TraceIt provides seamless package tracking solutions for businesses and individuals. Track your deliveries with confidence and precision.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">support@traceit.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">1234 Tracking Blvd, Delivery City</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email" required />
              </div>
              <Input placeholder="Subject" required />
              <Textarea 
                placeholder="Your Message" 
                className="min-h-[120px]" 
                required
              />
              <Button type="submit" className="px-8">
                Send Message
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TraceIt. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/help" className="text-sm text-gray-600 hover:text-primary">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
