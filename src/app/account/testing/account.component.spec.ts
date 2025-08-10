import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountComponent } from '../components/account.component';
import { AccountService } from '../services/account.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let mockAccountService: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AccountService', ['addAccount', 'getAccounts', 'deleteAccount', 'getTotalBalance']);

    await TestBed.configureTestingModule({
      declarations: [AccountComponent],
      imports: [FormsModule],
      providers: [
        { provide: AccountService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an account', () => {
    component.newAccount.name = 'Test Account';
    component.newAccount.balance= 1000;
    component.addAccount();
    
    expect(mockAccountService.addAccount).toHaveBeenCalledWith({ name: 'Test Account', balance: 1000 });
  });

  it('should delete account and update state', () => {
    component.deleteAccountName = 'Test Account';
    component.showDeleteDialog = true;
    const mockAccounts = [{ name: 'Savings', balance: 1000 }];
    mockAccountService.getAccounts.and.returnValue(mockAccounts);

    component.deleteAccount();

    expect(mockAccountService.deleteAccount).toHaveBeenCalledWith('Test Account');
    expect(mockAccountService.getAccounts).toHaveBeenCalled();
    expect(component.accounts).toEqual(mockAccounts);
    expect(component.showDeleteDialog).toBe(false);
  });
});