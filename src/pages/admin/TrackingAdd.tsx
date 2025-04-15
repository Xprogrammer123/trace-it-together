import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
import { TrackingFormData } from "@/types/tracking";
import { supabase } from "@/integrations/supabase/client";

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

const addTrackingRecord = async (data: TrackingFormData) => {
  const { data: result, error } = await supabase
    .from('tracking')
    .insert([data])
    .select();

  if (error) {
    throw error;
  }
  
  return result[0];
};

const AdminTrackingAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      tracking_code: "",
      status: "Pending",
      current_location: "",
      destination: "",
      comment: "",
      shipper_name: "",
      shipper_address: "",
      receiver_name: "",
      receiver_address: "",
    },
  });

  const onSubmit = async (values: TrackingFormData) => {
    setIsSubmitting(true);
    try {
      await addTrackingRecord(values);
      queryClient.invalidateQueries({ queryKey: ['tracking'] });
      toast.success("Tracking record created successfully");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to create tracking record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Tracking Record</h2>
        <p className="text-gray-500 mt-1">
          Create a new tracking record for a package in the system.
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
                <FormField
                  control={form.control}
                  name="tracking_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Code</FormLabel>
                      <FormControl>
                        <Input placeholder="TRK-123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      Creating...
                    </>
                  ) : (
                    "Create Tracking Record"
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

export default AdminTrackingAdd;
