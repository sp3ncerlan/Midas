import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalBalance: number = 0;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.totalBalance = this.accountService.getTotalBalance();
  }
}
