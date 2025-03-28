
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackingFormData, TrackingInfo } from "@/types/tracking";

// Form schema validation (same as in TrackingAdd.tsx)
const trackingSchema = z.object({
  tracking_code: z.string().min(6, "Tracking code must be at least 6 characters"),
  status: z.string().min(1, "Status is required"),
  current_location: z.string().min(1, "Current location is required"),
  destination: z.string().min(1, "Destination is required"),
  comment: z.string().optional(),
  shipper_name: z.string().min(1, "Shipper name is required"),
  shipper_address: z.string().min(1, "Shipper address is required"),
  receiver_name: z.string().min(1, "Receiver name is required"),
  receiver_address: z.string().min(1, "Receiver address is required"),
});

// In a real app, this would call Supabase
const fetchTrackingRecord = async (trackingCode: string): Promise<TrackingInfo> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - in a real app, this would fetch from Supabase
  return {
    id: 1,
    tracking_code: trackingCode,
    status: "In Transit",
    last_updated: new Date().toISOString(),
    current_location: "Chicago, IL",
    destination: "New York, NY",
    comment: "Package is on schedule",
    shipper_name: "Electronics Warehouse",
    shipper_address: "123 Shipper St, Chicago, IL",
    receiver_name: "John Smith",
    receiver_address: "456 Receiver Ave, New York, NY",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  };
};

// In a real app, this would call Supabase
const updateTrackingRecord = async (data: TrackingFormData): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would make a PUT request to Supabase
  console.log("Updating tracking record:", data);
  return;
};

const AdminTrackingEdit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackingId } = useParams<{ trackingId: string }>();
  const navigate = useNavigate();

  const form = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      tracking_code: "",
      status: "",
      current_location: "",
      destination: "",
      comment: "",
      shipper_name: "",
      shipper_address: "",
      receiver_name: "",
      receiver_address: "",
    },
  });

  useEffect(() => {
    const loadTrackingData = async () => {
      if (!trackingId) {
        toast.error("No tracking ID provided");
        navigate("/admin");
        return;
      }

      try {
        const trackingData = await fetchTrackingRecord(trackingId);
        
        // Reset form with fetched data
        form.reset({
          tracking_code: trackingData.tracking_code,
          status: trackingData.status,
          current_location: trackingData.current_location,
          destination: trackingData.destination,
          comment: trackingData.comment,
          shipper_name: trackingData.shipper_name,
          shipper_address: trackingData.shipper_address,
          receiver_name: trackingData.receiver_name,
          receiver_address: trackingData.receiver_address,
        });
      } catch (error) {
        toast.error("Failed to load tracking data");
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrackingData();
  }, [trackingId, navigate, form]);

  const onSubmit = async (values: TrackingFormData) => {
    setIsSubmitting(true);
    try {
      await updateTrackingRecord(values);
      toast.success("Tracking record updated successfully");
      navigate("/admin");
    } catch (error) {
      toast.error("Failed to update tracking record");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Tracking Record</h2>
        <p className="text-gray-500 mt-1">
          Update the tracking information for {trackingId}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tracking Code (readonly) */}
                <FormField
                  control={form.control}
                  name="tracking_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TRK-123456"
                          {...field}
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Failed Delivery">Failed Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Location */}
                <FormField
                  control={form.control}
                  name="current_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Chicago, IL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Destination */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Comment */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about the package..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipper Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Shipper Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shipper_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipper Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipper_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipper Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Chicago, IL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Receiver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="receiver_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiver_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver Address</FormLabel>
                        <FormControl>
                          <Input placeholder="456 Oak St, New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Tracking Record"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrackingEdit;
