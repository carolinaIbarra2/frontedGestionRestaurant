import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  category: any =null;
  isEditing: boolean = false;
  selectedImage: File | null = null;
  errorMessage: string = '';

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  
  constructor(private categoryService: CategoryService, private route: ActivatedRoute ) {}

  ngOnInit(): void {
      
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.categoryService.getCategoryById(categoryId).subscribe(
        data => {
          this.category = data;
        },
        error => {
          console.error('Error al obtener la categoria;', error);
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
  
    if (!this.isEditing && this.category && this.category.id) {
      const formData = new FormData();
      formData.append('name', this.category.name);
      formData.append('code', this.category.code || '');
      formData.append('is_active', this.category.is_active.toString());
  
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      this.categoryService.updateCategory(this.category.id, formData).subscribe({
        next: () => {},
          error: (err) => {
            if (err.error && err.error.error) {
              this.errorMessage = err.error.error; // <-- mensaje del backend
            } else {
              this.errorMessage = 'Error en el registro. Verifique los datos.';
            }
          }
        });
    }
  }
  
  
}
