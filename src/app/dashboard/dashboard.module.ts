import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard.component";
import { CommonModule } from "@angular/common";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, NgxChartsModule, ReactiveFormsModule],
  providers: [],
  exports: [DashboardComponent]
})
export class DashboardModule {}