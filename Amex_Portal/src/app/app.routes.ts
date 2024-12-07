// app-routing.module.ts
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { BuyersComponent } from './views/customers/buyers/buyers.component';
import { MerchantsComponent } from './views/merchants/merchants.component';
import { AllBuyersComponent } from './views/customers/all-buyers/all-buyers.component';
import { MyBuyersComponent } from './views/customers/my-buyers/my-buyers.component';
import { Payments } from './views/payments/payments.component';
import { UserManagementComponent } from './views/settings/user-management/user-management.component';
import { TypeProductsComponent } from './views/settings/type-products/type-products.component';
import { CalendarComponent } from './views/settings/calendar/calendar.component';
import { BuyerConfigComponent } from './views/buyer-config/buyer-config.component';
import { ProgramsComponent } from './views/settings/programs/programs.component';
import { AddProgramsComponent } from './views/settings/add-programs/add-programs.component';
import { ManageSupplierComponent } from './views/customers/manage-suppliers/manage-suppliers.component';
import { AddInvoiceComponent } from './views/customers/add-invoice/add-invoice.component';

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
        path: 'suppliers',
        component: MerchantsComponent, // Temporary placeholder
      },
      {
        path: 'user-management',
        component: UserManagementComponent, // Temporary placeholder
      },
      {
        path: 'typeproducts',
        component: TypeProductsComponent, // Temporary placeholder
      },
      {
        path: 'holidaysetup',
        component: CalendarComponent, // Temporary placeholder
      },
      {
        path: 'buyerconfig',
        component: BuyerConfigComponent, // Temporary placeholder
      },
      {
        path: 'programs',
        component: ProgramsComponent, // Temporary placeholder
      },
      {
        path: 'addprograms',
        component: AddProgramsComponent,
      },
      {
        path: 'managesuppliers',
        component: ManageSupplierComponent,
      },
      {
        path: 'add-invoices',
        component: AddInvoiceComponent,
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