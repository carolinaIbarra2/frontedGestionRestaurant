import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PurchaseEntryListComponent } from "./purchase-entry-list/purchase-entry-list.component";

const routes: Routes = [
    { path: '', component: PurchaseEntryListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseEntryRoutingModule { }

