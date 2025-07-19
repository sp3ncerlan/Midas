import { Component } from '@angular/core';
import { AccountService } from '../../account/services/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
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
