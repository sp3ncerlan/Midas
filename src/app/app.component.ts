import { Component } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'midas-finance';
}
