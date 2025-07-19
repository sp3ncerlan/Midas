import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar/components/navbar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [NavbarComponent],
  imports: [RouterModule],
  providers: [],
  exports: [NavbarComponent]
})
export class SharedModule {}