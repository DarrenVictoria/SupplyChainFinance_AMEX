// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { BuyersComponent } from './views/customers/buyers/buyers.component';
import { MerchantsComponent } from './views/customers/merchants/merchants.component';
import { AllBuyersComponent } from './views/customers/all-buyers/all-buyers.component';
import { MyBuyersComponent } from './views/customers/my-buyers/my-buyers.component';
import { Payments } from './views/customers/payments/payments.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        component: BuyersComponent // Use the BuyersComponent here
      },
      {
        path: 'payments',
        component: Payments, // Temporary placeholder
      },
      {
        path: 'all-buyers',
        component: AllBuyersComponent, // Temporary placeholder
      },
      {
        path: 'my-buyers',
        component: MyBuyersComponent, // Temporary placeholder
      },
      {
        path: 'approvals',
        component: PlaceholderComponent, // Temporary placeholder
      },
      {
        path: 'buyers',
        component: BuyersComponent // Use the BuyersComponent here
      },
      {
        path: 'merchants',
        component: MerchantsComponent, // Temporary placeholder
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];