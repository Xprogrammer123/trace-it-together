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
import { formatDate, getDeliveryMessage } from "@/lib/utils";
import { TrackingInfo } from "@/types/tracking";
import { supabase } from "@/integrations/supabase/client";

// Fetch tracking info from Supabase
const fetchTrackingInfo = async (trackingId: string): Promise<TrackingInfo> => {
  // Fetch tracking record
  const { data: trackingData, error: trackingError } = await supabase
    .from('tracking')
    .select('*')
    .eq('tracking_code', trackingId)
    .single();

  if (trackingError) {
    throw new Error("Tracking code not found");
  }

  // Fetch tracking history
  const { data: historyData, error: historyError } = await supabase
    .from('tracking_history')
    .select('*')
    .eq('tracking_id', trackingData.id)
    .order('created_at', { ascending: false });

  if (historyError) {
    console.error("History fetch error:", historyError);
    // Continue with just tracking data
  }

  return {
    ...trackingData,
    history: historyData || []
  } as TrackingInfo;
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
      case "In Transit":
      case "Processing":
        return "bg-blue-500";
      case "Pending":
        return "bg-amber-500";
      case "Failed Delivery":
        return "bg-red-500";
      case "Out for Delivery":
        return "bg-purple-500";
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
                            : getDeliveryMessage(data.delivery_date)}
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
            
            {/* Tracking Timeline */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                {data.history && data.history.length > 0 ? (
                  <div className="relative space-y-2">
                    {data.history.map((historyItem, index) => (
                      <div key={historyItem.id} className="relative border-l-2 border-gray-200 pl-6 py-2">
                        <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                        <p className="font-medium">{historyItem.status}</p>
                        <p className="text-sm text-gray-500">{formatDate(historyItem.created_at)}</p>
                        <p className="text-gray-600">{historyItem.comment || historyItem.location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative border-l-2 border-gray-200 pl-6 py-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                    <p className="font-medium">{data.status}</p>
                    <p className="text-sm text-gray-500">{formatDate(data.last_updated)}</p>
                    <p className="text-gray-600">{data.comment || `Current location: ${data.current_location}`}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
