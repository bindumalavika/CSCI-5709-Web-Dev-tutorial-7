import { CommonModule } from '@angular/common';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductCardComponent, ProductModalComponent],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  isModalOpen: boolean = false;
  selectedProduct: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('ProductsComponent initialized');
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  openAddProductModal() {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  onProductSave(product: any) {
    console.log('Product saved');
    if (product._id) {
      this.productService.updateProduct(product).subscribe(() => {
        this.loadProducts();
      });
    } else {
      this.productService.addProduct(product).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onModalClose() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  editProduct(id: number) {
    console.log('Edit product', id);
    const product = this.products.find((p) => p._id === id);

    if (product) {
      this.selectedProduct = product;
      this.isModalOpen = true;
    }
  }

  deleteProduct(id: number) {
    console.log('Delete product', id);
    if (confirm('Are you sure you want to delete this product?')) {
      // Here you would typically also call a service to delete the product from the backend
      console.log(`Product with id ${id} deleted`);
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  ngOnDestroy() {
    console.log('ProductsComponent destroyed');
  }
}
