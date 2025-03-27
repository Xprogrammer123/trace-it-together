
export interface TrackingInfo {
  id: number;
  tracking_code: string;
  status: string;
  last_updated: string;
  current_location: string;
  destination: string;
  comment: string;
  shipper_name: string;
  shipper_address: string;
  receiver_name: string;
  receiver_address: string;
  created_at: string;
}

export interface TrackingFormData {
  tracking_code: string;
  status: string;
  current_location: string;
  destination: string;
  comment?: string;
  shipper_name: string;
  shipper_address: string;
  receiver_name: string;
  receiver_address: string;
}
