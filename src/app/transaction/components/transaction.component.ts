import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: false,
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent {
  showAddDialog: boolean = false;
  showEditDialog: boolean = false;
  showAllTransactionDialog: boolean = false;
  showDeleteDialog: boolean = false;
  currentDate: string;
  transactionForm: FormGroup;
  monthTransactions: any[] = [];
  allTransactions: any[] = [];
  transactionToDelete: any = null;

  constructor(
    private transactionService: TransactionService,
    private fb: FormBuilder,
  ) {
    this.transactionForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
    const today = new Date();
    this.currentDate = today.getFullYear() + '-' +
                     String(today.getMonth() + 1).padStart(2, '0') + '-' +
                     String(today.getDate()).padStart(2, '0');
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.allTransactions = this.transactionService.getTransactions()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    this.monthTransactions = this.allTransactions.filter(transaction => {
      const transactionDate = transaction.date;
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    })

    console.log(this.monthTransactions)
  }

  openAllTransactionsDialog(): void {
    this.showAllTransactionDialog = true;
  }

  closeAllTransactionsDialog(): void {
    this.showAllTransactionDialog = false;
  }

  openAddTransactionDialog(): void {
    this.showAddDialog = true;
    this.transactionForm.reset();
  }

  openEditTransactionDialog(): void {
    this.showEditDialog = true;
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
  }

  onAddTransaction(): void {
    if (this.transactionForm.valid) {
      const dateString = this.transactionForm.value.date;
      const [year, month, day] = dateString.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      const transaction = {
        ...this.transactionForm.value,
        id: Date.now(),
        date: localDate,
        amount: parseFloat(this.transactionForm.value.amount)
      };
      
      this.transactionService.addTransaction(transaction);
      this.loadTransactions();
      this.closeAddDialog();
    }
  }

  editTransaction(transaction: any): void {
    this.showEditDialog = true;
    this.transactionForm.patchValue({
      id: transaction.id,
      date: new Date(transaction.date).toISOString().split('T')[0],
      description: transaction.description,
      amount: transaction.amount
    });
  }

  onSaveEditedTransaction(): void {
    if (this.transactionForm.valid) {
      const dateString = this.transactionForm.value.date;
      const [year, month, day] = dateString.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      const updatedTransaction = {
        ...this.transactionForm.value,
        date: localDate
      };

      const index = this.allTransactions.findIndex(
        transaction => transaction.id === updatedTransaction.id
      );

      if (index !== -1) {
        this.allTransactions[index] = updatedTransaction;
        this.transactionService.saveTransactions();
        this.loadTransactions();
        this.closeEditDialog();
      }
    }
  }

  onDeleteTransaction(transaction: any): void {
    this.transactionToDelete = transaction;
    this.showDeleteDialog = true;
  }

  onCloseDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.transactionToDelete = null;
  }

  deleteTransaction(transactionId?: number): void {
    const idToDelete = transactionId || this.transactionToDelete?.id;

    console.log(idToDelete)
    
    if (idToDelete) {
      this.allTransactions = this.allTransactions.filter(
        transaction => transaction.id !== idToDelete
      );

      this.transactionService.setTransactions(this.allTransactions);
      this.loadTransactions();
    }

    if (this.showDeleteDialog) {
      this.onCloseDeleteDialog();
    }
  }
}