import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  inventory: any[] = []

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  updating: { [productId: number]: boolean } = {};

  constructor(private inventoryService: InventoryService, private router: Router) {}

  ngOnInit(): void {
      this.getProducts();
  }

  getProducts(page: number = 1) {
    this.inventoryService.listInventory(page).subscribe((data: PaginatedResponse) => {
      this.inventory = data.items;
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getProducts(this.currentPage - 1);
    }
  }

  updateMinimumStock(item: any): void {
    const data = { minimum_stock: item.minimum_stock };
    this.updating[item.product_id] = true;

    this.inventoryService.updateInventory
    (item.product_id, data).subscribe({
      next: () => {
        alert(`Stock mínimo de "${item.product_name}" actualizado correctamente`);
      },
      error: (err) => {
        alert(`Error al actualizar el stock mínimo de "${item.product_name}"`);
        console.error(err);
      },
      complete: () => {
        this.updating[item.product_id] = false;
      }
    });
  }
}
