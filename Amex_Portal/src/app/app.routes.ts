// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { BuyersComponent } from './views/customers/buyers/buyers.component';
import { MerchantsComponent } from './views/customers/merchants/merchants.component';

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
        component: PlaceholderComponent, // Temporary placeholder
      },
      {
        path: 'users',
        component: PlaceholderComponent, // Temporary placeholder
      },
      {
        path: 'supplier-registration',
        component: PlaceholderComponent, // Temporary placeholder
      },
      {
        path: 'types-of-models',
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
        path: 'supplier-registration/company-types',
        component: PlaceholderComponent, // Temporary placeholder
      },
      {
        path: 'supplier-registration/registration-documents',
        component: PlaceholderComponent, // Temporary placeholder
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