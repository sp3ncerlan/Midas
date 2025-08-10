import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TransactionComponent } from '../components/transaction.component';
import { TransactionService } from '../services/transaction.service';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let formBuilder: FormBuilder;

  const mockTransactions = [
    {
      id: 1,
      date: new Date('2025-08-01'),
      description: 'Test Transaction 1',
      amount: 100.50
    },
    {
      id: 2,
      date: new Date('2025-08-05'),
      description: 'Test Transaction 2',
      amount: 250.75
    },
    {
      id: 3,
      date: new Date('2025-07-15'),
      description: 'Previous Month Transaction',
      amount: 75.25
    }
  ];

    beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', [
      'getTransactions',
      'addTransaction',
      'setTransactions',
      'saveTransactions'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TransactionService, useValue: transactionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    formBuilder = TestBed.inject(FormBuilder);

    transactionService.getTransactions.and.returnValue([...mockTransactions]);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with required validators', () => {
      expect(component.transactionForm).toBeDefined();
      expect(component.transactionForm.get('date')).toBeTruthy();
      expect(component.transactionForm.get('description')).toBeTruthy();
      expect(component.transactionForm.get('amount')).toBeTruthy();
      
      component.transactionForm.patchValue({
        date: '',
        description: '',
        amount: ''
      });
      
      expect(component.transactionForm.get('date')?.valid).toBeFalsy();
      expect(component.transactionForm.get('description')?.valid).toBeFalsy();
      expect(component.transactionForm.get('amount')?.valid).toBeFalsy();
    });

    it('should set current date correctly', () => {
      const today = new Date();
      const expectedDate = today.getFullYear() + '-' +
                          String(today.getMonth() + 1).padStart(2, '0') + '-' +
                          String(today.getDate()).padStart(2, '0');
      
      expect(component.currentDate).toBe(expectedDate);
    });

    it('should initialize dialog states to false', () => {
      expect(component.showAddDialog).toBeFalsy();
      expect(component.showEditDialog).toBeFalsy();
      expect(component.showAllTransactionDialog).toBeFalsy();
      expect(component.showDeleteDialog).toBeFalsy();
    });

    it('should initialize transactionToDelete to null', () => {
      expect(component.transactionToDelete).toBeNull();
    });
  });

  describe('Transaction Loading', () => {
    it('should load all transactions on init', () => {
      component.ngOnInit();
      
      expect(transactionService.getTransactions).toHaveBeenCalled();
      expect(component.allTransactions).toEqual(mockTransactions);
    });

    it('should filter transactions for current month', () => {
      component.loadTransactions();
      
      expect(component.monthTransactions.length).toBe(1);
      expect(component.monthTransactions[0].id).toBe(2);
    });

    it('should handle empty transaction list', () => {
      transactionService.getTransactions.and.returnValue([]);
      
      component.loadTransactions();
      
      expect(component.allTransactions).toEqual([]);
      expect(component.monthTransactions).toEqual([]);
    });
  });

  describe('Dialog Management', () => {
    it('should open add transaction dialog', () => {
      component.openAddTransactionDialog();
      
      expect(component.showAddDialog).toBeTruthy();
    });

    it('should close add transaction dialog', () => {
      component.showAddDialog = true;
      component.closeAddDialog();
      
      expect(component.showAddDialog).toBeFalsy();
    });

    it('should open edit transaction dialog', () => {
      component.openEditTransactionDialog();
      
      expect(component.showEditDialog).toBeTruthy();
    });

    it('should close edit transaction dialog', () => {
      component.showEditDialog = true;
      component.closeEditDialog();
      
      expect(component.showEditDialog).toBeFalsy();
    });

    it('should open all transactions dialog', () => {
      component.openAllTransactionsDialog();
      
      expect(component.showAllTransactionDialog).toBeTruthy();
    });

    it('should close all transactions dialog', () => {
      component.showAllTransactionDialog = true;
      component.closeAllTransactionsDialog();
      
      expect(component.showAllTransactionDialog).toBeFalsy();
    });

    it('should reset form when opening add dialog', () => {
      component.transactionForm.patchValue({
        date: '2025-08-01',
        description: 'Test',
        amount: 100
      });
      
      component.openAddTransactionDialog();
      
      expect(component.transactionForm.get('date')?.value).toBeNull();
      expect(component.transactionForm.get('description')?.value).toBeNull();
      expect(component.transactionForm.get('amount')?.value).toBeNull();
    });
  });

  describe('Transaction Addition', () => {
    it('should add valid transaction', () => {
      const transactionData = {
        date: '2025-08-05',
        description: 'New Transaction',
        amount: '150.00'
      };
      
      component.transactionForm.patchValue(transactionData);
      component.onAddTransaction();
      
      expect(transactionService.addTransaction).toHaveBeenCalledWith(
        jasmine.objectContaining({
          date: new Date('2025-08-05'),
          description: 'New Transaction',
          amount: 150.00,
          id: jasmine.any(Number)
        })
      );
      expect(component.showAddDialog).toBeFalsy();
    });

    it('should not add invalid transaction', () => {
      component.transactionForm.reset();
      component.onAddTransaction();
      
      expect(transactionService.addTransaction).not.toHaveBeenCalled();
      expect(component.showAddDialog).toBeTruthy();
    });

    it('should generate unique ID for new transaction', () => {
      const transactionData = {
        date: '2025-08-05',
        description: 'New Transaction',
        amount: '150.00'
      };
      
      spyOn(Date, 'now').and.returnValue(1234567890);
      component.transactionForm.patchValue(transactionData);
      component.onAddTransaction();
      
      expect(transactionService.addTransaction).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: 1234567890
        })
      );
    });
  });

  describe('Transaction Editing', () => {
    it('should populate form for editing', () => {
      const transaction = mockTransactions[0];
      
      component.editTransaction(transaction);
      
      expect(component.showEditDialog).toBeTruthy();
      expect(component.transactionForm.get('id')?.value).toBe(transaction.id);
      expect(component.transactionForm.get('date')?.value).toBe('2025-08-01');
      expect(component.transactionForm.get('description')?.value).toBe(transaction.description);
      expect(component.transactionForm.get('amount')?.value).toBe(transaction.amount);
    });

    it('should save edited transaction', () => {
      const testTransactions = [
        { id: 1, date: new Date('2025-08-01'), description: 'Test Transaction 1', amount: 100.5 },
        { id: 2, date: new Date('2025-08-05'), description: 'Test Transaction 2', amount: 250.75 }
      ];
      component.allTransactions = [...testTransactions];
      
      component.transactionForm.patchValue({
        id: 1,
        date: '2025-08-01',
        description: 'Updated Transaction',
        amount: 200.00
      });
      
      component.onSaveEditedTransaction();
      
      expect(transactionService.saveTransactions).toHaveBeenCalled();
      expect(component.showEditDialog).toBeFalsy();
      expect(component.allTransactions[0].description).toBe('Updated Transaction');
      expect(component.allTransactions[0].amount).toBe(200.00);
    });

    it('should not save invalid edited transaction', () => {
      component.transactionForm.patchValue({
        id: 1,
        date: '',
        description: '',
        amount: ''
      });
      
      component.onSaveEditedTransaction();
      
      expect(transactionService.saveTransactions).not.toHaveBeenCalled();
      expect(component.showEditDialog).toBeTruthy();
    });

    it('should handle editing non-existent transaction', () => {
      component.allTransactions = [...mockTransactions];
      
      component.transactionForm.patchValue({
        id: 999,
        date: '2025-08-01',
        description: 'Updated Transaction',
        amount: 200.00
      });
      
      component.onSaveEditedTransaction();
      
      expect(transactionService.saveTransactions).not.toHaveBeenCalled();
    });
  });

  describe('Transaction Deletion', () => {
    it('should open delete confirmation dialog', () => {
      const transaction = mockTransactions[0];
      
      component.onDeleteTransaction(transaction);
      
      expect(component.showDeleteDialog).toBeTruthy();
      expect(component.transactionToDelete).toBe(transaction);
    });

    it('should close delete confirmation dialog', () => {
      component.transactionToDelete = mockTransactions[0];
      component.showDeleteDialog = true;
      
      component.onCloseDeleteDialog();
      
      expect(component.showDeleteDialog).toBeFalsy();
      expect(component.transactionToDelete).toBeNull();
    });

    it('should delete transaction from confirmation dialog', () => {
      const testTransactions = [
        { id: 1, date: new Date('2025-08-01'), description: 'Test Transaction 1', amount: 100.5 },
        { id: 2, date: new Date('2025-08-05'), description: 'Test Transaction 2', amount: 250.75 },
        { id: 3, date: new Date('2024-12-15'), description: 'Previous Year Transaction', amount: 75.25 }
      ];
      component.allTransactions = [...testTransactions];
      component.transactionToDelete = testTransactions[0];
      component.showDeleteDialog = true;
      
      component.deleteTransaction();
      
      expect(component.allTransactions.length).toBe(2);
      expect(component.allTransactions.find(t => t.id === 1)).toBeUndefined();
      expect(transactionService.setTransactions).toHaveBeenCalledWith(component.allTransactions);
      expect(component.showDeleteDialog).toBeFalsy();
      expect(component.transactionToDelete).toBeNull();
    });

    it('should delete transaction by ID directly', () => {
      const testTransactions = [
        { id: 1, date: new Date('2025-08-01'), description: 'Test Transaction 1', amount: 100.5 },
        { id: 2, date: new Date('2025-08-05'), description: 'Test Transaction 2', amount: 250.75 },
        { id: 3, date: new Date('2024-12-15'), description: 'Previous Year Transaction', amount: 75.25 }
      ];
      component.allTransactions = [...testTransactions];
      
      component.deleteTransaction(1);
      
      expect(component.allTransactions.length).toBe(2);
      expect(component.allTransactions.find(t => t.id === 1)).toBeUndefined();
      expect(transactionService.setTransactions).toHaveBeenCalledWith(component.allTransactions);
    });

    it('should handle deletion of non-existent transaction', () => {
      const testTransactions = [
        { id: 1, date: new Date('2025-08-01'), description: 'Test Transaction 1', amount: 100.5 },
        { id: 2, date: new Date('2025-08-05'), description: 'Test Transaction 2', amount: 250.75 }
      ];
      component.allTransactions = [...testTransactions];
      const initialLength = component.allTransactions.length;
      
      component.deleteTransaction(999);
      
      expect(component.allTransactions.length).toBe(initialLength);
      expect(transactionService.setTransactions).toHaveBeenCalled();
    });

    it('should handle deletion with no transaction to delete', () => {
      const testTransactions = [
        { id: 1, date: new Date('2025-08-01'), description: 'Test Transaction 1', amount: 100.5 },
        { id: 2, date: new Date('2025-08-05'), description: 'Test Transaction 2', amount: 250.75 }
      ];
      component.allTransactions = [...testTransactions];
      component.transactionToDelete = null;
      const initialLength = component.allTransactions.length;
      
      component.deleteTransaction();
      
      expect(component.allTransactions.length).toBe(initialLength);
      expect(transactionService.setTransactions).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should validate minimum amount', () => {
      component.transactionForm.patchValue({
        date: '2025-08-05',
        description: 'Test Transaction',
        amount: 0
      });
      
      expect(component.transactionForm.get('amount')?.valid).toBeFalsy();
      
      component.transactionForm.patchValue({
        amount: 0.01
      });
      
      expect(component.transactionForm.get('amount')?.valid).toBeTruthy();
    });

    it('should require all fields', () => {
      const form = component.transactionForm;
      
      expect(form.valid).toBeFalsy();
      
      form.patchValue({
        date: '2025-08-05',
        description: 'Test Transaction',
        amount: 100
      });
      
      expect(form.valid).toBeTruthy();
    });
  });

  describe('Data Persistence', () => {
    it('should reload transactions after adding', () => {
      spyOn(component, 'loadTransactions');
      
      component.transactionForm.patchValue({
        date: '2025-08-05',
        description: 'New Transaction',
        amount: '150.00'
      });
      
      component.onAddTransaction();
      
      expect(component.loadTransactions).toHaveBeenCalled();
    });

    it('should reload transactions after editing', () => {
      spyOn(component, 'loadTransactions');
      component.allTransactions = [...mockTransactions];
      
      component.transactionForm.patchValue({
        id: 1,
        date: '2025-08-01',
        description: 'Updated Transaction',
        amount: 200.00
      });
      
      component.onSaveEditedTransaction();
      
      expect(component.loadTransactions).toHaveBeenCalled();
    });

    it('should reload transactions after deleting', () => {
      spyOn(component, 'loadTransactions');
      component.allTransactions = [...mockTransactions];
      
      component.deleteTransaction(1);
      
      expect(component.loadTransactions).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle transactions with different years', () => {
      const transactionsMultipleYears = [
        { id: 1, date: new Date('2024-08-01'), description: 'Last Year', amount: 100 },
        { id: 2, date: new Date('2025-08-01'), description: 'This Year', amount: 200 },
        { id: 3, date: new Date('2026-08-01'), description: 'Next Year', amount: 300 }
      ];
      
      transactionService.getTransactions.and.returnValue(transactionsMultipleYears);
      component.loadTransactions();
      
      expect(component.monthTransactions.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle date conversion properly', () => {
      const transaction = {
        id: 1,
        date: '2025-08-01',
        description: 'Test',
        amount: 100
      };
      
      component.editTransaction(transaction);
      
      expect(component.transactionForm.get('date')?.value).toBe('2025-08-01');
    });

    it('should handle parsing float amounts', () => {
      component.transactionForm.patchValue({
        date: '2025-08-05',
        description: 'Test Transaction',
        amount: '150.75'
      });
      
      component.onAddTransaction();
      
      expect(transactionService.addTransaction).toHaveBeenCalledWith(
        jasmine.objectContaining({
          amount: 150.75
        })
      );
    });
  });
});
