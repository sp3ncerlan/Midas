import { Component } from '@angular/core';
import { AccountService } from '../../account/services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../transaction/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalBalance: number = 0;
  currentBudget: number = 0.00;
  currentSpend: number = 0.00;
  showBudgetDialog: boolean = false;
  budgetForm: FormGroup;

  constructor(private accountService: AccountService, private transactionService: TransactionService, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      budget: [null, [Validators.required, Validators.min(0.01)]]
    })
  }

  ngOnInit(): void {
    this.loadBudget();
    this.loadSpend();
    this.totalBalance = this.accountService.getTotalBalance();
  }

  onSetBudgetClick() {
    this.showBudgetDialog = true;
  }

  closeSetBudgetDialog() {
    this.showBudgetDialog = false;
  }

  onSetBudget(): void {
    if (this.budgetForm.valid) {
      this.currentBudget = this.budgetForm.value.budget;
      this.saveBudget();
      this.closeSetBudgetDialog();
    }
  }

  loadBudget(): void {
    const savedBudget = localStorage.getItem('currentBudget');
    this.currentBudget = savedBudget ? parseFloat(savedBudget) : 0;
  }

  saveBudget(): void {
    localStorage.setItem('currentBudget', this.currentBudget.toString());
  }

  loadSpend(): void {
    const transactions = this.transactionService.getTransactions();
    let totalSpend = 0;

    for (const transaction of transactions) {
      totalSpend += transaction.amount;
    }

    this.currentSpend = totalSpend;
  }
}