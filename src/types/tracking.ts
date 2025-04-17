export interface TrackingHistory {
  id: string;
  tracking_id: string;
  status: string;
  location: string;
  comment?: string;
  created_at: string;
}

export interface TrackingInfo {
  id: string;
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
  history?: TrackingHistory[];
  delivery_date: string;
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
  delivery_date: string;
}
