import { NgModule } from '@angular/core';
import { TransactionComponent } from './components/transaction.component';
import { TransactionService } from './services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TransactionComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [TransactionService],
  exports: [TransactionComponent],
})
export class TransactionModule {}
