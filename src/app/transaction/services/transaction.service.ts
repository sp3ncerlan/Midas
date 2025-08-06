import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: any[] = [];

  constructor() {
    this.loadTransactions();

    // Add test data if no transactions exist
    if (this.transactions.length === 0) {
      console.log('No transactions found, adding test data...');
      this.transactions = [
        { date: new Date('2024-01-15'), description: 'Test 2024 Transaction 1', amount: 100 },
        { date: new Date('2024-07-20'), description: 'Test 2024 Transaction 2', amount: 200 },
        { date: new Date('2025-01-10'), description: 'Test 2025 Transaction', amount: 150 }
      ];
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
        date: new Date(transaction.date) // Ensure date is converted to Date object
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