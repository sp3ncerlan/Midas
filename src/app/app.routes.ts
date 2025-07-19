import { Routes } from '@angular/router';
import { AccountComponent } from './account/components/account.component';
import { TransactionComponent } from './transaction/components/transaction.component';
import { DashboardComponent } from './dashboard/components/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'accounts', component: AccountComponent },
  { path: 'transactions', component: TransactionComponent },
  { path: '', redirectTo: '/accounts', pathMatch: 'full' },
];
