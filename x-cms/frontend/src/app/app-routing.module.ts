import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterLoginGuard, BeforeLoginGuard } from './services/guard.service';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { MenuViewComponent } from 'src/app/components/menu/menu-view/menu-view.component';
import { MenuAddComponent } from 'src/app/components/menu/menu-add/menu-add.component';
import { MenuEditComponent } from 'src/app/components/menu/menu-edit/menu-edit.component';
import { AccountComponent } from 'src/app/components/account/account.component';
import { UserViewComponent } from './components/user/user-view/user-view.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { RoleViewComponent } from './components/role/role-view/role-view.component';
import { RoleAddComponent } from './components/role/role-add/role-add.component';
import { RoleEditComponent } from './components/role/role-edit/role-edit.component';
import { RoleDetailComponent } from './components/role/role-detail/role-detail.component';
import { PortfolioViewComponent } from './components/portfolio/portfolio-view/portfolio-view.component';
import { PortfolioAddComponent } from './components/portfolio/portfolio-add/portfolio-add.component';
import { PortfolioEditComponent } from './components/portfolio/portfolio-edit/portfolio-edit.component';
import { PortfolioDetailComponent } from './components/portfolio/portfolio-detail/portfolio-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full', data: { title: 'Home' } },
  { path: 'login', component: LoginComponent, canActivate: [BeforeLoginGuard], data: { title: 'Login' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AfterLoginGuard], data: { title: 'Dashboard' } },
  {
    path: 'menu', canActivate: [AfterLoginGuard],
    children: [
        { path: '', component: MenuViewComponent, data: { title: 'Menu Navigation' } },
        { path: 'add', component: MenuAddComponent, data: { title: 'Add Menu' } },
        { path: ':id/edit', component: MenuEditComponent, data: { title: 'Edit Menu' } }
    ]
  },
  {
    path: 'users', canActivate: [AfterLoginGuard],
    children: [
        { path: '', component: UserViewComponent, data: { title: 'User Account' } },
        { path: 'add', component: UserAddComponent, data: { title: 'Add User Account' } },
        { path: ':id/edit', component: UserEditComponent, data: { title: 'Edit User Account' } },
        { path: ':id', component: UserDetailComponent, data: { title: 'Detail User Account' } }
    ]
  },
  {
    path: 'portfolios', canActivate: [AfterLoginGuard],
    children: [
        { path: '', component: PortfolioViewComponent, data: { title: 'Portfolio List' } },
        { path: 'add', component: PortfolioAddComponent, data: { title: 'Add Portfolio' } },
        { path: ':id/edit', component: PortfolioEditComponent, data: { title: 'Edit Portfolio' } },
        { path: ':id', component: PortfolioDetailComponent, data: { title: 'Detail Portfolio' } }
    ]
  },
  {
    path: 'roles', canActivate: [AfterLoginGuard],
    children: [
        { path: '', component: RoleViewComponent, data: { title: 'User Role' } },
        { path: 'add', component: RoleAddComponent, data: { title: 'Add User Role' } },
        { path: ':id/edit', component: RoleEditComponent, data: { title: 'Edit User Role' } },
        { path: ':id', component: RoleDetailComponent, data: { title: 'Detail User Role' } }
    ]
  },
  { path: 'account', component: AccountComponent, canActivate: [AfterLoginGuard], data: { title: 'Account' } },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
