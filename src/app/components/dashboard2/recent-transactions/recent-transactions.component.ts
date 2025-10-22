import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

interface transactions {
  id: number;
  iconColor: string;
  icon: string;
  title: string;
  subtitle: string;
  amount: string;
  status: string;
}

@Component({
  selector: 'app-recent-transactions',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './recent-transactions.component.html',
})
export class AppRecentTransactionsComponent {
  transactions: transactions[] = [
    {
      id: 1,
      iconColor: 'secondary',
      icon: 'currency-dollar',
      title: 'PayPal Transfer',
      subtitle: 'Money Added',
      amount: '+$350',
      status: 'success',
    },
    {
      id: 2,
      iconColor: 'success',
      icon: 'shield',
      title: 'Wallet',
      subtitle: 'Bill Payment',
      amount: '-$560',
      status: 'error',
    },
    {
      id: 3,
      iconColor: 'error',
      icon: 'credit-card',
      title: 'Credit Card',
      subtitle: 'Money reversed',
      amount: '+$350',
      status: 'success',
    },
    {
      id: 4,
      iconColor: 'warning',
      icon: 'check',
      title: 'Bank Transfer',
      subtitle: 'Money Added',
      amount: '+$350',
      status: 'success',
    },
    {
      id: 5,
      iconColor: 'secondary',
      icon: 'currency-dollar',
      title: 'Refund',
      subtitle: 'Payment Sent',
      amount: '-$50',
      status: 'error',
    },
  ];
}
