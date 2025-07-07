import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from './account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  @Output() totalAmount = new EventEmitter<number>();
  
  accounts: { name: string; balance: number }[] = [];
  newAccount = { name: '', balance: NaN };
  editingAccount = { name: '', balance: NaN };
  deleteAccountName = '';
  showAddDialog = false;
  showEditDialog = false;
  showDeleteDialog = false;
  errorMessage = '';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accounts = this.accountService.getAccounts();
  }

  onCloseAddAccount() {
    this.showAddDialog = false;
  }

  onCloseEditDialog() {
    this.showEditDialog = false;
  }

  onCloseDeleteDialog() {
    this.showDeleteDialog = false;
  }

  openEditDialog(account: { name: string; balance: number }) {
    this.editingAccount = { ...account }
    this.showEditDialog = true;
  }

  openDeleteDialog(name: string) {
    this.deleteAccountName = name;
    this.showDeleteDialog = true;
  }

  addAccount() {
    if (isNaN(this.newAccount.balance)) {
      this.errorMessage = "Please enter a valid balance...";
      return;
    }

    const success = this.accountService.addAccount(this.newAccount);
    console.log(success)
    if (success) {
      this.accounts = this.accountService.getAccounts();
      this.newAccount = { name: '', balance: 0}
      this.showAddDialog = false;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'This account is already created';
    }
  }

  editAccount() {
    const success = this.accountService.updateAccountBalance(this.editingAccount.name, this.editingAccount.balance);
    
    if (success) {
      this.accounts = this.accountService.getAccounts();
      this.showEditDialog = false;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'An account with this name already exists';
    }
  }

  deleteAccount() {
    this.accountService.deleteAccount(this.deleteAccountName);
    this.accounts = this.accountService.getAccounts();
    this.showDeleteDialog = false;
  }
}
