import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  products: any =null;
  isEditing: boolean = false;
  selectedImage: File | null = null;
  categories: any[] = [];

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  
    
  constructor(private productService: ProductService, private route: ActivatedRoute ) {}

  ngOnInit(): void {

    this.loadCategories();
      
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        data => {
          this.products = data;

          if (this.products.category) {
            this.products.category = [this.products.category];
          }
        },
        error => {
          console.error('Error al obtener el producto;', error);
        }
      );
    }
  }


  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Método para simular el click
  onClickFileInput(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }
  

  edit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.products && this.products.id) {
      const formData = new FormData();
      formData.append('name', this.products.name);
      formData.append('category', this.products.category);
      formData.append('description', this.products.description);
      formData.append('price', this.products.price);
      formData.append('is_active', this.products.is_active.toString());

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.productService.updateProduct(this.products.id, formData).subscribe(
        (response: any) => {
          console.log('Producto actualizado con imagen');
        },
        (error: any) => {
          console.error('Error al actualizar producto con imagen', error);
        }
      );
    }
  }


  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.items;
      },
      error: (err) => {
        console.error('Error cargando categorias:', err);
      }
    });
  }

  get productCategoriesText(): string {
    return Array.isArray(this.products?.category) && this.products.category.length
      ? this.products.category.map((category: any) => category.name).join(', ')
      : 'Sin categorías';
  }
  
}
