// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';

import { PaymentsComponent } from './views/payments/payments.component';
import { RegisterComponent} from './auth/register.component'
import { CompanyRegistrationComponent } from './auth/company-registration/company-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyerGridComponent } from './views/buyer-grid/buyer-grid.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'payments',
        component: PaymentsComponent
      },
      {
        path: 'buyers',
        component: BuyerGridComponent
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
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'company-registration',
    component: CompanyRegistrationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];