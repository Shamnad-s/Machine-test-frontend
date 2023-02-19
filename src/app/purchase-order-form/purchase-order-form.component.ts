import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { FormDataService } from '../services/form-data.service';
import { PurchaseOrder } from '../models/purchaseOrder';
import { ItemDetails } from '../models/orderNumber';
@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss'],
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
  ]
})
export class PurchaseOrderFormComponent implements OnInit {
  orderDetails = { vendors: [], products: [], poNo: '', poDate: '' };
  selectedVendor: string = '';
  selectedProduct: string = '';
  vendors = [];
  products = [];
  form!: FormGroup;
  purchaseOrder!: PurchaseOrder;
  isSubmitted = false;
  editmode = false;
  currentOrderId: string = '';
  items: any;
  order: any;
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.formDataService.getFormDetails().subscribe({
      next: (res) => {
        this.orderDetails = res;
        this.vendors = res.vendors;
        this.products = res.products;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.buildForm();
  }

  onSubmit() {
    this.createForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      vendor: ['', Validators.required],

      location: ['', Validators.required],
      items: this.formBuilder.array([this.buildItemDetails()]),
    });
  }
  buildItemDetails(): FormGroup {
    return this.formBuilder.group({
      productName: ['', Validators.required],
      quantity: [
        { value: 0, disabled: false },
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      amount: [
        { value: 0, disabled: false },
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      discount: [
        { value: 0, disabled: false },
        [
          Validators.required,
          Validators.min(0),
          Validators.max(99),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }

  get item_details() {
    return this.form.get('items') as FormArray;
  }

  addSellingPoint() {
    this.item_details.push(
      new FormGroup({
        productName: new FormControl(Validators.required),
        quantity: new FormControl(
          { value: 0, disabled: false },
          Validators.required
        ),
        amount: new FormControl(
          { value: 0, disabled: false },
          Validators.required
        ),
        discount: new FormControl(
          { value: 0, disabled: false },
          Validators.required
        ),
      })
    );
  }
  deleteSellingPoint(index: number) {
    this.item_details.removeAt(index);
  }

  createForm() {
    this.order = this.form.value;
    this.formDataService.createForm(this.form.value).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Order is created!`,
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Order is not created!',
        });
      },
    });
  }
  saveForm() {
    console.log(this.order);
    this.order = this.orderForm['value'];
    console.log(this.order);
  }

  onCancle() {
    this.location.back();
  }

  get orderForm() {
    return this.form.controls;
  }
}
