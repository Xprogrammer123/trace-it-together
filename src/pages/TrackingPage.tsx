
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TruckIcon, ClockIcon, MapPinIcon, PackageIcon, CheckCircle2Icon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackingForm } from "@/components/TrackingForm";
import { formatDate } from "@/lib/utils";
import { TrackingInfo } from "@/types/tracking";

// This would typically be a real API call to your backend
const fetchTrackingInfo = async (trackingId: string): Promise<TrackingInfo> => {
  // Simulating API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data - In a real app, this would fetch from your Supabase API
  const mockData: Record<string, TrackingInfo> = {
    "ABC123": {
      id: 1,
      tracking_code: "ABC123",
      status: "Shipped",
      last_updated: new Date("2024-09-20").toISOString(),
      current_location: "Transit Hub, New York",
      destination: "Lagos",
      comment: "Out for delivery",
      shipper_name: "John Doe",
      shipper_address: "123 Street NY",
      receiver_name: "Jane Doe",
      receiver_address: "456 Street LA",
      created_at: new Date("2024-09-18").toISOString()
    },
    "XYZ456": {
      id: 2,
      tracking_code: "XYZ456",
      status: "Pending",
      last_updated: new Date("2024-09-18").toISOString(),
      current_location: "Warehouse, Texas",
      destination: "Abuja",
      comment: "Waiting for pickup",
      shipper_name: "Alice Brown",
      shipper_address: "789 Road TX",
      receiver_name: "Bob White",
      receiver_address: "101 Ave FL",
      created_at: new Date("2024-09-17").toISOString()
    }
  };
  
  if (mockData[trackingId]) {
    return mockData[trackingId];
  }
  
  throw new Error("Tracking code not found");
};

const TrackingPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [searchTrackingId, setSearchTrackingId] = useState(trackingId || "");
  const navigate = useNavigate();
  
  // Use React Query for data fetching with caching
  const { data, isLoading, error } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: () => fetchTrackingInfo(trackingId!),
    enabled: !!trackingId,
    retry: false,
    staleTime: 60000, // 1 minute
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId) {
      toast.error("Please enter a tracking number");
      return;
    }
    navigate(`/track/${searchTrackingId}`);
  };

  // Show error message for invalid tracking codes
  useEffect(() => {
    if (error) {
      toast.error("Tracking code not found. Please check and try again.");
    }
  }, [error]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      case "Shipped":
        return "bg-blue-500";
      case "Pending":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-white py-16">
        <div className="container max-w-4xl">
          <Button 
            variant="ghost" 
            className="text-white mb-6 hover:bg-primary/20" 
            onClick={() => navigate("/")}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to home
          </Button>
          <h1 className="text-3xl font-bold mb-6">Track Your Package</h1>
          
          {/* Search Form */}
          {!trackingId && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <TrackingForm />
            </div>
          )}
          
          {/* Small search form when already tracking a package */}
          {trackingId && (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 mb-2">
              <Input
                type="text"
                placeholder="Enter another tracking number"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button type="submit">Track</Button>
            </form>
          )}
        </div>
      </div>
      
      {/* Tracking Results */}
      <div className="container max-w-4xl py-10">
        {trackingId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-1">Tracking Number: <span className="text-primary">{trackingId}</span></h2>
            <p className="text-gray-500 text-sm">Enter a different tracking number above to track another package</p>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
        
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Tracking Information Not Found</CardTitle>
              <CardDescription>We couldn't find any information for tracking number: {trackingId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Please check the tracking number and try again, or contact customer support if you believe this is an error.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/")}>Return to Home</Button>
            </CardFooter>
          </Card>
        )}
        
        {data && (
          <>
            {/* Status Card */}
            <Card className="mb-8 overflow-hidden">
              <div className={`h-2 ${getStatusColor(data.status)} w-full`}></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Shipment Status</CardTitle>
                  <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
                </div>
                <CardDescription>Last updated: {formatDate(data.last_updated)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-100 p-2 rounded-md">
                        <MapPinIcon className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Location</p>
                        <p className="font-medium">{data.current_location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-100 p-2 rounded-md">
                        <PackageIcon className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Destination</p>
                        <p className="font-medium">{data.destination}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-purple-100 p-2 rounded-md">
                        <TruckIcon className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Shipment Status</p>
                        <p className="font-medium">{data.status}</p>
                        {data.comment && <p className="text-sm text-gray-500">{data.comment}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-green-100 p-2 rounded-md">
                        <ClockIcon className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                        <p className="font-medium">
                          {data.status === "Delivered" 
                            ? "Package delivered" 
                            : "1-2 business days"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Shipper/Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipper Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{data.shipper_name}</p>
                    <p className="text-gray-500">{data.shipper_address}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receiver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{data.receiver_name}</p>
                    <p className="text-gray-500">{data.receiver_address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tracking Timeline - This would be more elaborate in a real app */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-gray-200 pl-6 py-2">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <p className="font-medium">{data.status}</p>
                  <p className="text-sm text-gray-500">{formatDate(data.last_updated)}</p>
                  <p className="text-gray-600">{data.comment}</p>
                </div>
                <div className="relative border-l-2 border-gray-200 pl-6 py-2">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-200"></div>
                  <p className="font-medium">Package Received</p>
                  <p className="text-sm text-gray-500">{formatDate(data.created_at)}</p>
                  <p className="text-gray-600">Package received for shipping</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
