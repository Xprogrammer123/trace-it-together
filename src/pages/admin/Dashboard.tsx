
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

// In a real app, this would call Supabase
const fetchTrackingData = async (): Promise<TrackingInfo[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return [
    {
      id: 1,
      tracking_code: "TRK-123456",
      status: "Delivered",
      last_updated: new Date().toISOString(),
      current_location: "Los Angeles, CA",
      destination: "San Francisco, CA",
      comment: "Left at front door",
      shipper_name: "Electronics Warehouse",
      shipper_address: "123 Shipper St, NY",
      receiver_name: "John Smith",
      receiver_address: "456 Receiver Ave, SF",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      tracking_code: "TRK-789012",
      status: "In Transit",
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      current_location: "Chicago, IL",
      destination: "Miami, FL",
      comment: "Package delayed due to weather",
      shipper_name: "Fashion Outlet",
      shipper_address: "789 Shipper Rd, Chicago",
      receiver_name: "Alice Johnson",
      receiver_address: "101 Receiver Blvd, Miami",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      tracking_code: "TRK-345678",
      status: "Processing",
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      current_location: "Dallas, TX",
      destination: "Boston, MA",
      comment: "Awaiting pickup by carrier",
      shipper_name: "Books Direct",
      shipper_address: "222 Publisher Ln, Dallas",
      receiver_name: "Robert Williams",
      receiver_address: "333 Reader St, Boston",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// In a real app, this would call Supabase
const deleteTracking = async (id: number): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this would make a DELETE request to Supabase
  console.log(`Deleting tracking with ID: ${id}`);
  return;
};

const AdminDashboard = () => {
  const [trackingData, setTrackingData] = useState<TrackingInfo[]>([]);
  const [filteredData, setFilteredData] = useState<TrackingInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number | null;
    trackingCode: string;
  }>({
    open: false,
    id: null,
    trackingCode: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTrackingData();
        setTrackingData(data);
        setFilteredData(data);
      } catch (error) {
        toast.error("Failed to load tracking data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
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
      
      // Update local state
      const newData = trackingData.filter(item => item.id !== deleteConfirm.id);
      setTrackingData(newData);
      setFilteredData(
        filteredData.filter(item => item.id !== deleteConfirm.id)
      );
      
      toast.success("Tracking entry deleted successfully");
      setDeleteConfirm({ open: false, id: null, trackingCode: "" });
    } catch (error) {
      toast.error("Failed to delete tracking entry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tracking Management</h2>
        <Link to="/admin/add">
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
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
          ) : filteredData.length > 0 ? (
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
                                id: item.id,
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
