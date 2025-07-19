import { NgModule } from "@angular/core";
import { AccountService } from "./services/account.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountComponent } from "./components/account.component";

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, FormsModule],
  providers: [AccountService],
  exports: [AccountComponent]
})
export class AccountModule {}