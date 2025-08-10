import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: any[] = [];

  constructor() {
    this.loadTransactions();

    if (this.transactions.length === 0) {
      // avoid null transactions length, set default to []
      this.transactions = [];
      this.saveTransactions();
    }
  }

  loadTransactions(): void {
    const storedTransactions = localStorage.getItem('transactions');
    console.log('Stored transactions from localStorage:', storedTransactions);
    
    if (storedTransactions) {
      const parsed = JSON.parse(storedTransactions);
      this.transactions = parsed.map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date) // conversion to date object
      }));
    } else {
      this.transactions = [];
    }
    
    console.log('Loaded transactions:', this.transactions);
  }

  getTransactions(): any[] {
    return this.transactions;
  }

  setTransactions(transactions: any[]): void {
    this.transactions = transactions;
    this.saveTransactions();
  }

  getTransactionsByYear(year: number): { [key: string]: any[] } {
    const transactionsByYear = this.transactions.filter(transaction => {
      return new Date(transaction.date).getFullYear() === year;
    });

    const transactionsByMonth: { [key: string]: any[] } = {};
    for (const transaction of transactionsByYear) {
      const month = transaction.date.toLocaleString('default', { month: 'long' });
      if (!transactionsByMonth[month]) {
        transactionsByMonth[month] = [];
      }
      transactionsByMonth[month].push(transaction);
    }
    return transactionsByMonth;
  }

  addTransaction(transaction: any): void {
    this.transactions.push(transaction);
    this.saveTransactions();
  }

  saveTransactions(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions))
  }
}