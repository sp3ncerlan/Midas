import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountComponent },
  { path: 'transactions', component: TransactionComponent },
  { path: '', redirectTo: '/accounts', pathMatch: 'full' },
];
