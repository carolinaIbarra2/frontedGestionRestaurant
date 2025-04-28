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
  errorMessage: string = '';

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
      formData.append('name', this.products.name || '');
      if (Array.isArray(this.products.category) && this.products.category.length > 0) {
        formData.append('category', this.products.category[0].id.toString());
      } else if (typeof this.products.category === 'object' && this.products.category !== null) {
        formData.append('category', this.products.category.id.toString());
      } else {
        formData.append('category', '');
      }
  
      formData.append('description', this.products.description || '');
      formData.append('price', this.products.price?.toString() || '');
      formData.append('is_active', this.products.is_active ? 'true' : 'false');
  
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      this.productService.updateProduct(this.products.id, formData).subscribe({
        next: () => {},
        error: (err) => {
          if (err.error && err.error.error) {
            this.errorMessage = err.error.error;
          } else {
            this.errorMessage = 'Error en el registro. Verifique los datos.';
          }
        }
      });
    }
  }
  


  loadCategories(): void {
    let allCategories: any[] = [];
    let page = 1;
  
    const loadPage = () => {
      this.productService.getCategories({ page: page,  page_size:20 }).subscribe({
        next: (data) => {
          allCategories = allCategories.concat(data.items);
          if (data.next) {
            page++;
            loadPage();
          } else {
            this.categories = allCategories;
          }
        },
        error: (err) => {
          console.error('Error cargando categorías:', err);
        }
      });
    };
  
    loadPage();
  }
  

  get productCategoriesText(): string {
    return Array.isArray(this.products?.category) && this.products.category.length
      ? this.products.category.map((category: any) => category.name).join(', ')
      : 'Sin categorías';
  }
  
}
