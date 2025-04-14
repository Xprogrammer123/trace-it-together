
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Search, Edit, Trash2, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TrackingInfo } from "@/types/tracking";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch tracking data from Supabase
const fetchTrackingData = async (): Promise<TrackingInfo[]> => {
  const { data, error } = await supabase
    .from('tracking')
    .select(`
      id,
      tracking_code,
      status,
      last_updated,
      current_location,
      destination,
      comment,
      shipper_name,
      shipper_address,
      receiver_name,
      receiver_address,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as TrackingInfo[];
};

// Delete tracking record in Supabase
const deleteTracking = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tracking')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState<TrackingInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string | null;
    trackingCode: string;
  }>({
    open: false,
    id: null,
    trackingCode: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: trackingData, isLoading, error } = useQuery({
    queryKey: ['tracking'],
    queryFn: fetchTrackingData,
  });

  useEffect(() => {
    if (!trackingData) return;
    
    if (!searchTerm) {
      setFilteredData(trackingData);
      return;
    }
    
    const filtered = trackingData.filter((item) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        item.tracking_code.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue) ||
        item.receiver_name.toLowerCase().includes(searchValue) ||
        item.destination.toLowerCase().includes(searchValue)
      );
    });
    
    setFilteredData(filtered);
  }, [searchTerm, trackingData]);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    
    setIsDeleting(true);
    try {
      await deleteTracking(deleteConfirm.id);
      queryClient.invalidateQueries({ queryKey: ['tracking'] });
      toast.success("Tracking entry deleted successfully");
      setDeleteConfirm({ open: false, id: null, trackingCode: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tracking entry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-red-500">Error loading tracking data</h3>
        <p className="text-gray-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tracking Management</h2>
        <Link to="/admin/tracking/add">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Tracking</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tracking Entries</CardTitle>
          <div className="relative max-w-sm mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tracking codes, status..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredData?.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead className="hidden lg:table-cell">Receiver</TableHead>
                    <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-500" />
                          {item.tracking_code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : item.status === "In Transit"
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.status}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{item.destination}</TableCell>
                      <TableCell className="hidden lg:table-cell">{item.receiver_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(item.last_updated)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/edit/${item.tracking_code}`}>
                            <Button variant="outline" size="icon">
                              <Edit size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => 
                              setDeleteConfirm({
                                open: true,
                                id: item.id.toString(),
                                trackingCode: item.tracking_code
                              })
                            }
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? "No matching tracking records found" : "No tracking records available"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete tracking record {deleteConfirm.trackingCode}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ open: false, id: null, trackingCode: "" })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
