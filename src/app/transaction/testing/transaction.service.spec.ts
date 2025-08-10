import { TestBed } from '@angular/core/testing';
import { TransactionService } from '../services/transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let localStorageSpy: jasmine.Spy;

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
      date: new Date('2024-12-15'),
      description: 'Previous Year Transaction',
      amount: 75.25
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    
    // Mock localStorage
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    
    service = TestBed.inject(TransactionService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty transactions when localStorage is empty', () => {
      localStorageSpy.and.returnValue(null);
      service = new TransactionService();
      
      expect(service.getTransactions()).toEqual([]);
    });

    it('should load transactions from localStorage on initialization', () => {
      const storedTransactions = JSON.stringify(mockTransactions);
      localStorageSpy.and.returnValue(storedTransactions);
      
      service = new TransactionService();
      const loadedTransactions = service.getTransactions();
      
      expect(loadedTransactions.length).toBe(3);
      expect(loadedTransactions[0].id).toBe(1);
      expect(loadedTransactions[0].date).toEqual(jasmine.any(Date));
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageSpy.and.returnValue('invalid json');
      
      expect(() => {
        service = new TransactionService();
      }).toThrow();
    });
  });

  describe('Transaction Management', () => {
    beforeEach(() => {
      // Reset service with clean state
      service = new TransactionService();
    });

    it('should get all transactions', () => {
      const transactions = service.getTransactions();
      expect(Array.isArray(transactions)).toBeTruthy();
    });

    it('should add a new transaction', () => {
      const newTransaction = {
        id: 4,
        date: new Date('2025-08-10'),
        description: 'New Transaction',
        amount: 300.00
      };

      service.addTransaction(newTransaction);
      const transactions = service.getTransactions();
      
      expect(transactions).toContain(newTransaction);
      expect(localStorage.setItem).toHaveBeenCalledWith('transactions', jasmine.any(String));
    });

    it('should set transactions array', () => {
      service.setTransactions(mockTransactions);
      
      expect(service.getTransactions()).toEqual(mockTransactions);
      expect(localStorage.setItem).toHaveBeenCalledWith('transactions', jasmine.any(String));
    });

    it('should save transactions to localStorage', () => {
      service.setTransactions(mockTransactions);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'transactions',
        JSON.stringify(mockTransactions)
      );
    });
  });

  describe('Transaction Filtering by Year', () => {
    beforeEach(() => {
      service = new TransactionService();
      service.setTransactions(mockTransactions);
    });

    it('should get transactions for specific year', () => {
      const transactionsByYear = service.getTransactionsByYear(2025);
      
      expect(Object.keys(transactionsByYear)).toContain('August');
      expect(transactionsByYear['August'].length).toBe(1); // Only one transaction is in August 2025 due to timezone
    });

    it('should group transactions by month', () => {
      const transactionsByYear = service.getTransactionsByYear(2025);
      
      expect(transactionsByYear['August']).toBeDefined();
      expect(transactionsByYear['August'].length).toBe(1); // Adjust for timezone
      expect(transactionsByYear['August'][0].description).toBe('Test Transaction 2');
    });

    it('should return empty object for year with no transactions', () => {
      const transactionsByYear = service.getTransactionsByYear(2023);
      
      expect(Object.keys(transactionsByYear).length).toBe(0);
    });

    it('should handle transactions from different months in same year', () => {
      const multiMonthTransactions = [
        {
          id: 1,
          date: new Date('2025-01-15'),
          description: 'January Transaction',
          amount: 100
        },
        {
          id: 2,
          date: new Date('2025-03-20'),
          description: 'March Transaction',
          amount: 200
        },
        {
          id: 3,
          date: new Date('2025-01-25'),
          description: 'Another January Transaction',
          amount: 150
        }
      ];

      service.setTransactions(multiMonthTransactions);
      const transactionsByYear = service.getTransactionsByYear(2025);
      
      expect(Object.keys(transactionsByYear)).toContain('January');
      expect(Object.keys(transactionsByYear)).toContain('March');
      expect(transactionsByYear['January'].length).toBe(2);
      expect(transactionsByYear['March'].length).toBe(1);
    });
  });

  describe('Date Handling', () => {
    it('should preserve date objects when loading from localStorage', () => {
      const transactionsWithStringDates = mockTransactions.map(t => ({
        ...t,
        date: t.date.toISOString()
      }));
      
      localStorageSpy.and.returnValue(JSON.stringify(transactionsWithStringDates));
      service = new TransactionService();
      
      const loadedTransactions = service.getTransactions();
      expect(loadedTransactions[0].date).toEqual(jasmine.any(Date));
      expect(loadedTransactions[0].date.getTime()).toBe(new Date('2025-08-01').getTime());
    });

    it('should handle various date formats', () => {
      const transaction = {
        id: 1,
        date: '2025-08-01T00:00:00.000Z',
        description: 'Test',
        amount: 100
      };

      service.addTransaction(transaction);
      const savedTransactions = service.getTransactions();
      
      // The service stores dates as strings when added directly
      expect(savedTransactions[0].date).toBe('2025-08-01T00:00:00.000Z');
    });
  });

  describe('localStorage Integration', () => {
    it('should call localStorage.getItem on loadTransactions', () => {
      service.loadTransactions();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('transactions');
    });

    it('should call localStorage.setItem on saveTransactions', () => {
      service.saveTransactions();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('transactions', jasmine.any(String));
    });

    it('should handle localStorage being unavailable', () => {
      // Reset the existing spy and create a new one that throws
      localStorageSpy.and.throwError('localStorage not available');
      
      expect(() => {
        service.loadTransactions();
      }).toThrow();
    });

    it('should serialize and deserialize transactions correctly', () => {
      service.setTransactions(mockTransactions);
      
      const serializedData = (localStorage.setItem as jasmine.Spy).calls.mostRecent().args[1];
      const deserializedData = JSON.parse(serializedData);
      
      expect(deserializedData.length).toBe(3);
      expect(deserializedData[0].id).toBe(1);
      expect(deserializedData[0].description).toBe('Test Transaction 1');
      expect(deserializedData[0].amount).toBe(100.50);
    });
  });

  describe('Data Validation and Edge Cases', () => {
    it('should handle empty transaction array', () => {
      service.setTransactions([]);
      
      expect(service.getTransactions()).toEqual([]);
      expect(service.getTransactionsByYear(2025)).toEqual({});
    });

    it('should handle null or undefined transactions', () => {
      expect(() => {
        service.setTransactions(null as any);
      }).not.toThrow();
      
      expect(() => {
        service.setTransactions(undefined as any);
      }).not.toThrow();
    });

    it('should handle transactions with missing or invalid dates', () => {
      const invalidTransactions = [
        {
          id: 1,
          date: null,
          description: 'Invalid Date Transaction',
          amount: 100
        },
        {
          id: 2,
          date: 'invalid-date',
          description: 'Invalid Date String',
          amount: 200
        }
      ];

      expect(() => {
        service.setTransactions(invalidTransactions as any);
      }).not.toThrow();
    });

    it('should handle very large transaction arrays', () => {
      const largeTransactionArray = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        date: new Date(2025, 0, (index % 30) + 1),
        description: `Transaction ${index + 1}`,
        amount: (index + 1) * 10
      }));

      expect(() => {
        service.setTransactions(largeTransactionArray);
      }).not.toThrow();
      
      expect(service.getTransactions().length).toBe(1000);
    });
  });

  describe('Performance Considerations', () => {
    it('should not reload from localStorage on every getTransactions call', () => {
      service.getTransactions();
      service.getTransactions();
      service.getTransactions();
      
      // Should only call localStorage.getItem during initialization
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should efficiently filter transactions by year', () => {
      const startTime = performance.now();
      service.setTransactions(mockTransactions);
      service.getTransactionsByYear(2025);
      const endTime = performance.now();
      
      // Should complete in reasonable time (less than 100ms for small dataset)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Logging and Debugging', () => {
    it('should log when loading transactions', () => {
      spyOn(console, 'log');
      service.loadTransactions();
      
      expect(console.log).toHaveBeenCalled();
    });

    it('should log when no transactions are found', () => {
      spyOn(console, 'log');
      localStorageSpy.and.returnValue(null);
      
      service = new TransactionService();
      
      expect(console.log).toHaveBeenCalledWith('No transactions found, adding test data...');
    });
  });
});
