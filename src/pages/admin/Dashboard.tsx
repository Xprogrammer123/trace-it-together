
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { TrackingInfo } from "@/types/tracking";

const AdminDashboard = () => {
  const { data: trackingData, isLoading } = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TrackingInfo[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>Tracking Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Shipper Name</TableHead>
                <TableHead>Shipper Address</TableHead>
                <TableHead>Receiver Name</TableHead>
                <TableHead>Receiver Address</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackingData?.map((tracking) => (
                <TableRow key={tracking.id}>
                  <TableCell>{tracking.tracking_code}</TableCell>
                  <TableCell>{tracking.status}</TableCell>
                  <TableCell>{tracking.current_location}</TableCell>
                  <TableCell>{tracking.destination}</TableCell>
                  <TableCell>{tracking.shipper_name}</TableCell>
                  <TableCell>{tracking.shipper_address}</TableCell>
                  <TableCell>{tracking.receiver_name}</TableCell>
                  <TableCell>{tracking.receiver_address}</TableCell>
                  <TableCell>{tracking.comment}</TableCell>
                  <TableCell>
                    {tracking.last_updated ? format(new Date(tracking.last_updated), 'PPpp') : '-'}
                  </TableCell>
                  <TableCell>
                    {tracking.created_at ? format(new Date(tracking.created_at), 'PPpp') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link to={`/admin/tracking/edit/${tracking.tracking_code}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminDashboard;
