// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { MerchantsComponent } from './views/merchants/merchants.component';
import { HomepageComponent } from './views/homepage/homepage.component';
import { PaymentsComponent } from './views/payments/payments.component';
import { InvoicesComponent } from './views/invoices/invoices.component';
import { AddInvoiceComponent } from './views/add-invoice/add-invoice.component';
import { UserManagementComponent } from './views/settings/user-management/user-management.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: PlaceholderComponent
      },
      {
        path: 'suppliers',
        component: MerchantsComponent
      },
      // {
      //   path: 'requests',
      //   children: [
      //     {
      //       path: 'creation',
      //       component: PlaceholderComponent
      //     },
      //     {
      //       path: 'submission',
      //       component: PlaceholderComponent
      //     }
      //   ]
      // },
      {
        path: 'invoices',
        component: InvoicesComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      },
      {
        path: 'add-invoice',
        component: AddInvoiceComponent
      },
      {
        path: 'user-management',
        component: UserManagementComponent
      },

      {
        path: '',
        redirectTo: 'merchants',
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