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
  transactionForm: FormGroup;
  monthTransactions: any[] = [];
  allTransactions: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.transactionForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.allTransactions = this.transactionService.getTransactions();

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    this.monthTransactions = this.allTransactions.filter(transaction => {
      const transactionDate = transaction.date;
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    })

    console.log(this.monthTransactions)
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
      const transaction = {
        ...this.transactionForm.value,
        id: Date.now(),
        date: new Date(this.transactionForm.value.date),
        amount: parseFloat(this.transactionForm.value.amount)
      };
      
      this.transactionService.addTransaction(transaction);
      this.loadTransactions();
      this.closeAddDialog();
    }
  }

  editTransaction(transaction: any): void {
    // Open the modal and pre-fill the form with the selected transaction's details
    this.showEditDialog = true;
    this.transactionForm.patchValue({
      id: transaction.id,
      date: new Date(transaction.date).toISOString().split('T')[0], // Format date for input
      description: transaction.description,
      amount: transaction.amount
    });
  }

  onSaveEditedTransaction(): void {
    if (this.transactionForm.valid) {
      const updatedTransaction = {
        ...this.transactionForm.value,
        date: new Date(this.transactionForm.value.date) // Convert date back to Date object
      };

      // Find the index of the transaction being edited
      const index = this.allTransactions.findIndex(
        transaction => transaction.id === updatedTransaction.id
      );

      if (index !== -1) {
        // Update the transaction in the array
        this.allTransactions[index] = updatedTransaction;

        // Persist the updated transactions
        this.transactionService.saveTransactions();

        // Reload the transactions for the current month
        this.loadTransactions();

        // Close the edit dialog
        this.closeEditDialog();
      }
    }
  }

  deleteTransaction(transactionId: number): void {
    this.allTransactions = this.allTransactions.filter(
      transaction => transaction.id !== transactionId
    );

    this.transactionService.setTransactions(this.allTransactions);
    this.loadTransactions();
  }
}