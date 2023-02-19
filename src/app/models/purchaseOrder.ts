import { ItemDetails } from './orderNumber';
export interface PurchaseOrder {
  id: string;
  vendor: string;
  poNo: string;
  poDate: Date;
  location: string;
  items: ItemDetails[];
}
