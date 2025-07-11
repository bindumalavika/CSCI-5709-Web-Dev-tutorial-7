import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private cacheKey = 'cachedProducts';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    const cachedProducts = localStorage.getItem(this.cacheKey);

    if (cachedProducts) {
      const parsedProducts = JSON.parse(cachedProducts);
      return of(parsedProducts);
    }

    console.log('Fetching products from API');
    
    return this.http.get<any[]>(`${environment.apiUrl}/products`).pipe(
      tap((products) => {
        localStorage.setItem(this.cacheKey, JSON.stringify(products));
      })
    );
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/products`, product).pipe(
      tap(() => {
        this.clearCache(); // Clear cache after adding a product;
      })
    );
  }

  updateProduct(product: any): Observable<any> {
    return this.http
      .put<any>(`${environment.apiUrl}/products/${product._id}`, product)
      .pipe(
        tap(() => {
          this.clearCache(); // Clear cache after adding a product;
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`).pipe(
      tap(() => {
        this.clearCache(); // Clear cache after adding a product;
      })
    );
  }

  private clearCache() {
    localStorage.removeItem(this.cacheKey);
  }
}
