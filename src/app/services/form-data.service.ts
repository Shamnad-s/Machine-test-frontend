import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseOrder } from '../models/purchaseOrder';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  apiUrlFoam = 'http://localhost:4000/form/';
  apiUrlOrderNumber = 'http://localhost:4000/form/order-number';
  constructor(private http: HttpClient) {}

  getFormDetails() {
    return this.http.get<{
      vendors: [];
      products: [];
      poNo: string;
      poDate: string;
    }>(this.apiUrlOrderNumber);
  }

  createForm(purchaseOrder: PurchaseOrder) {
    return this.http.post<{ response: string }>(this.apiUrlFoam, purchaseOrder);
  }
  getOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrlFoam);
  }
  getOrder(orderId: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrlFoam}${orderId}`);
  }
  updateOrder(purchaseOrder: PurchaseOrder){
    return this.http.post<PurchaseOrder[]>(`${this.apiUrlFoam}update`, purchaseOrder)
  }
  deleteOrder(purchaseOrderId: string): Observable<PurchaseOrder> {
    return this.http.delete<PurchaseOrder>(
      `${this.apiUrlFoam}${purchaseOrderId}`
    );
  }
}
