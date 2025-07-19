import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AccountModule } from "./account/account.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { TransactionModule } from "./transaction/transaction.module";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AccountModule,
    DashboardModule,
    TransactionModule,
    SharedModule
  ]
})
export class AppModule {}