import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an account', () => {
    const account = { name: 'Savings', balance: 5000 };
    service.addAccount(account);
    
    const accounts = service.getAccounts();
    expect(accounts.length).toBe(1);
    expect(accounts[0]).toEqual(account);
  });

  it('should delete an account', () => {
    service.addAccount({ name: 'Savings', balance: 5000 });
    service.addAccount({ name: 'Checking', balance: 2000 });
    
    service.deleteAccount('Savings');
    
    const accounts = service.getAccounts();
    expect(accounts.length).toBe(1);
    expect(accounts[0].name).toBe('Checking');
  });

  it('should calculate total balance', () => {
    service.addAccount({ name: 'Savings', balance: 5000 });
    service.addAccount({ name: 'Checking', balance: 2000 });
    
    const total = service.getTotalBalance();
    expect(total).toBe(7000);
  });

  it('should return 0 for empty accounts', () => {
    const total = service.getTotalBalance();
    expect(total).toBe(0);
  });

  it('should persist accounts to localStorage', () => {
    const account = { name: 'Test', balance: 1000 };
    service.addAccount(account);
    
    const stored = localStorage.getItem('accounts');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual([account]);
  });

  it('should load accounts from localStorage on init', () => {
    const testAccounts = [{ name: 'Existing', balance: 3000 }];
    localStorage.setItem('accounts', JSON.stringify(testAccounts));
    
    const newService = new AccountService();
    const accounts = newService.getAccounts();
    
    expect(accounts).toEqual(testAccounts);
  });
});