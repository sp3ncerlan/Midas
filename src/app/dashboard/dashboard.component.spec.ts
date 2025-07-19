import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AccountService } from '../account/account.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAccountService: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AccountService', ['getTotalBalance', 'getAccounts']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AccountService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load total balance on init', () => {
    mockAccountService.getTotalBalance.and.returnValue(5000);

    component.ngOnInit();

    expect(component.totalBalance).toBe(5000);
    expect(mockAccountService.getTotalBalance).toHaveBeenCalled();
  });

  it('should display accounts summary', () => {
    const mockAccounts = [
      { name: 'Savings', balance: 3000 },
      { name: 'Checking', balance: 2000 }
    ];
    mockAccountService.getAccounts.and.returnValue(mockAccounts);
    mockAccountService.getTotalBalance.and.returnValue(5000);

    component.ngOnInit();

    expect(component.totalBalance).toBe(5000);
  });

  it('should handle empty accounts', () => {
    mockAccountService.getAccounts.and.returnValue([]);
    mockAccountService.getTotalBalance.and.returnValue(0);

    component.ngOnInit();

    expect(component.totalBalance).toBe(0);
  });
});