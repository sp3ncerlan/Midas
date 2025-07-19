import { Component } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'midas-finance';
}
