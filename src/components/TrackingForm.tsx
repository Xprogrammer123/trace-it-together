
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function TrackingForm({ minimal = false }: { minimal?: boolean }) {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId) {
      toast.error("Please enter a tracking number");
      return;
    }
    
    // In a real app, validate tracking number format here
    if (trackingId.length < 6) {
      toast.error("Please enter a valid tracking number");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/track/${trackingId}`);
    }, 800);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={minimal 
        ? "flex w-full max-w-sm items-center space-x-2" 
        : "w-full max-w-md mx-auto"
      }
    >
      <div className={minimal ? "flex-1" : "relative mt-2"}>
        <Input
          type="text"
          placeholder="Enter your tracking number"
          className={minimal 
            ? "" 
            : "pr-12 h-14 text-base placeholder:text-gray-400 shadow-sm"
          }
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        {!minimal && (
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading}
            className="absolute right-1 top-1 h-12 w-12 rounded-md"
          >
            <Search className={`h-5 w-5 ${isLoading ? "opacity-70" : ""}`} />
            <span className="sr-only">Search</span>
          </Button>
        )}
      </div>
      
      {minimal && (
        <Button type="submit" disabled={isLoading}>
          Track
        </Button>
      )}
    </form>
  );
}
