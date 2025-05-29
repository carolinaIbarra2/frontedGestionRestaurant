import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';
import { PurchaseEntryService } from 'src/app/services/purchaseEntry.service';

@Component({
  selector: 'app-purchase-entry-list',
  templateUrl: './purchase-entry-list.component.html',
  styleUrls: ['./purchase-entry-list.component.css']
})
export class PurchaseEntryListComponent implements OnInit {

  purchaseEntries: any[] = []
  selectedPurchaseEntry: any = null;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    private purchaseEntryService: PurchaseEntryService, private router: Router
  ){}


  ngOnInit(): void {
      this.getPurchaseEntry();
  }


  getPurchaseEntry(page: number = 1) {
    this.purchaseEntryService.listPurchaseEntry(page).subscribe((data: PaginatedResponse) => {
          this.purchaseEntries = data.items;  // Extraemos solo los usuarios
          this.totalPages = data.total_pages;
          this.currentPage = data.current_page;
        });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getPurchaseEntry(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getPurchaseEntry(this.currentPage - 1);
    }
  }

}
