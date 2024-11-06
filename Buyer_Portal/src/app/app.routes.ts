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
        path: 'homepage',
        component: PlaceholderComponent
      },
      {
        path: 'dashboard',
        component: PlaceholderComponent
      },
      {
        path: 'merchants',
        component: PlaceholderComponent
      },
      {
        path: 'requests',
        children: [
          {
            path: 'creation',
            component: PlaceholderComponent
          },
          {
            path: 'submission',
            component: PlaceholderComponent
          }
        ]
      },
      {
        path: 'payments',
        component: PlaceholderComponent
      },
      {
        path: 'financial',
        component: PlaceholderComponent
      },
      {
        path: 'users',
        component: PlaceholderComponent
      },
      {
        path: 'business-activities',
        component: PlaceholderComponent
      },
      {
        path: '',
        redirectTo: 'homepage',
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