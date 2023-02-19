import { Component, OnInit } from '@angular/core';
import { FormDataService } from '../services/form-data.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { PurchaseOrder } from '../models/purchaseOrder';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
  animations: [
    trigger('myAnimation', [
      state(
        'start',
        style({
          opacity: 0.2,
        })
      ),
      state(
        'end',
        style({
          opacity: 1,
        })
      ),
      transition('start => end', [animate('1s')]),
    ]),
  ],
})
export class PurchaseOrderListComponent implements OnInit {
  formComponents: PurchaseOrder[] = [];
  purchaseOrders!: PurchaseOrder[];
  purchaseOrder!: PurchaseOrder;
  dialog: any;
 
  dataSource = new MatTableDataSource<PurchaseOrder>();
  constructor(
    private formdataService: FormDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getForm();
  }

  deleteForm(purchaseOrderId: string) {
    console.log(purchaseOrderId);
    this.confirmationService.confirm({
      message: 'Do you want to Delete this order?',
      header: 'Delete order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formdataService.deleteOrder(purchaseOrderId).subscribe(
          () => {
            this._getForm();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'order is deleted!',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'order is not deleted!',
            });
          }
        );
      },
    });
  }
  
  

  private _getForm() {
    this.formdataService
      .getOrders()
      .subscribe((purchaseOrders: PurchaseOrder[]) => {
       

        this.formComponents = purchaseOrders;
      });
  }

 
}
