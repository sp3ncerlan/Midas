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
  recentTransactions: any[] = [];
  averageDailySpend: number = 0;
  budgetRemaining: number = 0;
  monthlyTransactionCount: number = 0;

  constructor(private accountService: AccountService, private transactionService: TransactionService, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      budget: [null, [Validators.required, Validators.min(0.01)]]
    })
  }

  ngOnInit(): void {
    this.loadBudget();
    this.loadSpend();
    this.totalBalance = this.accountService.getTotalBalance();
    this.loadRecentTransactions();
    this.calculateStats();
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

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
        totalSpend += transaction.amount;
      }
    }

    this.currentSpend = totalSpend;
  }

  loadRecentTransactions(): void {
    const allTransactions = this.transactionService.getTransactions();
    this.recentTransactions = allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  calculateStats(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    
    this.averageDailySpend = currentDay > 0 ? this.currentSpend / currentDay : 0;
    this.budgetRemaining = this.currentBudget - this.currentSpend;
    this.monthlyTransactionCount = this.getMonthlyTransactionCount();
  }

  getBudgetProgressPercentage(): number {
    if (this.currentBudget === 0) return 0;
    return Math.min((this.currentSpend / this.currentBudget) * 100, 100);
  }

  getBudgetRemainingClass(): string {
    return this.budgetRemaining >= 0 ? 'text-green' : 'text-red';
  }

  getMonthlyTransactionCount(): number {
    const transactions = this.transactionService.getTransactions();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    }).length;
  }
}