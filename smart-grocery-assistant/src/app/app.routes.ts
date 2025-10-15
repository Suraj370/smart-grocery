import { Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/auth/signup/signup').then((m) => m.Signup),
      },
    ],
  },
  {
    path: 'grocery',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/grocery/grocery').then((m) => m.Grocery),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/grocery/create-grocery/create-grocery').then((m) => m.CreateGrocery),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/grocery/grocery-detail/grocery-detail').then((m) => m.GroceryDetail),
      },
    ],
  },
];
