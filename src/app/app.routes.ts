import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { PricingSuccessComponent } from './pages/theme-pages/pricing/pricing-success/pricing-success.component';
import { PricingFailureComponent } from './pages/theme-pages/pricing/pricing-failure/pricing-failure.component';
import { AboutUsComponent } from './pages/front-pages/about-us/about-us.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';
import { AppSideTwoStepsComponent } from './pages/authentication/side-two-steps/side-two-steps.component';
import { AppSideRegisterComponent } from './pages/authentication/side-register/side-register.component';
import { AppSideForgotPasswordComponent } from './pages/authentication/side-forgot-password/side-forgot-password.component';
import { AppMaintenanceComponent } from './pages/authentication/maintenance/maintenance.component';
import { AppErrorComponent } from './pages/authentication/error/error.component';
import { AppBoxedTwoStepsComponent } from './pages/authentication/boxed-two-steps/boxed-two-steps.component';
import { AppBoxedRegisterComponent } from './pages/authentication/boxed-register/boxed-register.component';
import { AppBoxedLoginComponent } from './pages/authentication/boxed-login/boxed-login.component';
import { AppBoxedForgotPasswordComponent } from './pages/authentication/boxed-forgot-password/boxed-forgot-password.component';
import { AppDashboard1Component } from './pages/dashboards/dashboard1/dashboard1.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      /*{
        path: '',
        redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },*/
      {
        path: '',
        redirectTo: '/apps/matchs',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
          canActivate: [AuthGuard]
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.routes').then(
            (m) => m.DashboardsRoutes
          ),
          canActivate: [AuthGuard]
      },

      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/forms/forms.routes').then((m) => m.FormsRoutes),
          canActivate: [AuthGuard]
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.routes').then((m) => m.ChartsRoutes),
          canActivate: [AuthGuard]
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/apps/apps.routes').then((m) => m.AppsRoutes),
          canActivate: [AuthGuard]
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.routes').then((m) => m.WidgetsRoutes),
          canActivate: [AuthGuard]
      },
      { 
        path: 'payment-success', component: PricingSuccessComponent, 
        //canActivate: [AuthGuard] },
      },
      { 
        path: 'payment-failed', component: PricingFailureComponent, 
        //canActivate: [AuthGuard] 
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.routes').then((m) => m.TablesRoutes),
          canActivate: [AuthGuard]
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/datatable/datatable.routes').then(
            (m) => m.DatatablesRoutes
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.routes').then(
            (m) => m.ThemePagesRoutes
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
          canActivate: [AuthGuard]
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'homes',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.routes').then(
            (m) => m.LandingPageRoutes
          ),
      },
      {
        path: 'front-pages',
        loadChildren: () =>
          import('./pages/front-pages/front-pages.routes').then(
            (m) => m.FrontPagesRoutes
          ), 
      },
    ],
  },
  {
          path: 'login',
          component: AppSideLoginComponent,
  },
  {
          path: 'boxed-forgot-pwd',
          component: AppBoxedForgotPasswordComponent,
        },
        {
          path: 'boxed-login',
          component: AppBoxedLoginComponent,
        },
        {
          path: 'boxed-register',
          component: AppBoxedRegisterComponent,
        },
        {
          path: 'boxed-two-steps',
          component: AppBoxedTwoStepsComponent,
        },
        {
          path: 'error',
          component: AppErrorComponent,
        },
        {
          path: 'maintenance',
          component: AppMaintenanceComponent,
        },
        {
          path: 'side-forgot-pwd',
          component: AppSideForgotPasswordComponent,
        },
        { 
          path: 'login/:token', 
          component: AppSideLoginComponent 
        },
        {
          path: 'side-register',
          component: AppSideRegisterComponent,
        },
        {
          path: 'side-two-steps',
          component: AppSideTwoStepsComponent,
        },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
