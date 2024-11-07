// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { MerchantsComponent } from './views/merchants/merchants.component';
import { HomepageComponent } from './views/homepage/homepage.component';
import { PaymentsComponent } from './views/payments/payments.component';
import { RegisterComponent} from './auth/register.component'

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'homepage',
        component: HomepageComponent
      },
      {
        path: 'dashboard',
        component: PlaceholderComponent
      },
      {
        path: 'merchants',
        component:  MerchantsComponent
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
        component: PaymentsComponent
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
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];