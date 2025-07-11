import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() product: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  productForm: FormGroup = new FormGroup({});
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    console.log('ngOnChanges called', this.isOpen, this.product);
    if (this.isOpen) {
      this.isEditMode = this.product !== null;
      this.createForm();

      if (this.isEditMode) {
        this.productForm.setValue({
          name: this.product.name,
          description: this.product.description,
          imageUrl: this.product.imageUrl,
          price: this.product.price,
          quantity: this.product.quantity,
        });
      }
    }
  }

  createForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onOverlayClick() {
    this.closeModal();
  }

  closeModal() {
    this.productForm.reset();
    this.isSubmitting = false;
    this.isOpen = false;
    this.close.emit();
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;

      const productData: any = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        imageUrl: this.productForm.value.imageUrl,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
      };

      if (this.isEditMode && this.product && this.product._id) {
        productData['_id'] = this.product._id;
      }

      setTimeout(() => {
        this.save.emit(productData);
        this.isSubmitting = false;
        this.closeModal();
      }, 1000);
    } else {
      for (let controlName in this.productForm.controls) {
        this.productForm.controls[controlName].markAsTouched();
      }
    }
  }
}
