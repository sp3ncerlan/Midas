import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AccountModule } from "./account/account.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { SharedModule } from "./shared/shared.module";
import { RouterModule } from "@angular/router"
import { routes } from "./app.routes";
import { TransactionModule } from "./transaction/transaction.module";
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AccountModule,
    DashboardModule,
    TransactionModule,
    SharedModule,
    NgxChartsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}