import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Search, Edit, Trash2, Loader2, PlusCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Tracking Management</h2>
        <Link to="/admin/tracking/add" className="w-full md:w-auto">
          <Button className="flex items-center gap-2 w-full md:w-auto">
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
            <div className="space-y-4">
              {filteredData.map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-sm">
                  <CardHeader className="sticky top-0 z-10 bg-background border-b p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-primary" />
                        <CardTitle className="text-base sm:text-lg">
                          {item.tracking_code}
                        </CardTitle>
                      </div>
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="overflow-x-auto p-0">
                    <div className="min-w-[600px] md:min-w-0">
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 p-4">
                        {/* Column 1 */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Current Location</p>
                            <p className="font-medium truncate" title={item.current_location}>
                              {item.current_location}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shipper</p>
                            <p className="font-medium truncate" title={item.shipper_name}>
                              {item.shipper_name}
                            </p>
                          </div>
                        </div>
                        
                        {/* Column 2 */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="font-medium truncate" title={item.destination}>
                              {item.destination}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shipper Address</p>
                            <p className="font-medium truncate" title={item.shipper_address}>
                              {item.shipper_address}
                            </p>
                          </div>
                        </div>
                        
                        {/* Column 3 */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Receiver</p>
                            <p className="font-medium truncate" title={item.receiver_name}>
                              {item.receiver_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Created</p>
                            <p className="font-medium">{formatDate(item.created_at)}</p>
                          </div>
                        </div>
                        
                        {/* Column 4 (hidden on mobile) */}
                        <div className="space-y-3 hidden md:block">
                          <div>
                            <p className="text-sm text-gray-500">Receiver Address</p>
                            <p className="font-medium truncate" title={item.receiver_address}>
                              {item.receiver_address}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p className="font-medium">{formatDate(item.last_updated)}</p>
                          </div>
                        </div>
                        
                        {/* Column 5 (hidden on mobile) */}
                        <div className="space-y-3 hidden md:block">
                          <div>
                            <p className="text-sm text-gray-500">Comment</p>
                            <p className="font-medium truncate" title={item.comment || '-'}>
                              {item.comment || '-'}
                            </p>
                          </div>
                          <div className="flex gap-2 justify-end md:justify-start">
                            <Link to={`/admin/tracking/edit/${item.tracking_code}`}>
                              <Button variant="outline" size="sm">
                                <Edit size={14} className="mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setDeleteConfirm({
                                open: true,
                                id: item.id.toString(),
                                trackingCode: item.tracking_code
                              })}
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Mobile actions (visible only on mobile) */}
                        <div className="col-span-3 flex gap-2 md:hidden">
                          <Link to={`/admin/tracking/edit/${item.tracking_code}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Edit size={14} className="mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 flex-1"
                            onClick={() => setDeleteConfirm({
                              open: true,
                              id: item.id.toString(),
                              trackingCode: item.tracking_code
                            })}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? "No matching tracking records found" : "No tracking records available"}
            </div>
          )}
        </CardContent>
      </Card>

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
