import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accounts: { name: string; balance: number }[] = [];
  private totalBalance = 0;

  constructor() {
    this.loadFromLocalStorage();
  }

  private calculateTotalBalance() {
    this.totalBalance = 0;
    for (const account of this.accounts) {
      this.totalBalance += account.balance;
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(this.accounts));
  }

  private loadFromLocalStorage() {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      this.accounts = JSON.parse(storedAccounts);
    }
  }

  getTotalBalance() {
    this.calculateTotalBalance();
    return this.totalBalance;
  }

  getAccounts() {
    return this.accounts;
  }

  // get single account vs. all accounts from above method
  getAccount(name: string) {
    return this.accounts.find((account) => account.name === name);
  }

  addAccount(account: { name: string; balance: number }) {
    const existingAccount = this.accounts.find(
      (acc) => acc.name.toLowerCase() === account.name.toLowerCase()
    );
    if (existingAccount) {
      return false;
    } else {
      this.accounts.push(account);
      this.saveToLocalStorage();
      return true;
    }
  }

  deleteAccount(name: string) {
    this.accounts = this.accounts.filter((account) => account.name !== name);
    this.saveToLocalStorage();
  }

  updateAccountBalance(name: string, newBalance: number) {
    const account = this.accounts.find((account) => account.name === name);
    if (account) {
      account.balance = newBalance;
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }
}
