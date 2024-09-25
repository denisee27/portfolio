import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe, FilterPipe, HaveKeysPipe, MePipe, NowPipe, NumberPipe, TimePipe } from './pipes/pipes.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HTTPInterceptorService } from './services/http-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxNumberFormatModule } from 'ngx-number-format';
import { NgxPrintModule } from 'ngx-print';
import { LightboxModule } from 'ngx-lightbox';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { SortableDirective } from './directives/sortable.directive';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { AccountComponent } from './components/account/account.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MenuViewComponent } from './components/menu/menu-view/menu-view.component';
import { MenuAddComponent } from './components/menu/menu-add/menu-add.component';
import { MenuEditComponent } from './components/menu/menu-edit/menu-edit.component';
import { UserViewComponent } from './components/user/user-view/user-view.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { RoleViewComponent } from './components/role/role-view/role-view.component';
import { RoleAddComponent } from './components/role/role-add/role-add.component';
import { RoleEditComponent } from './components/role/role-edit/role-edit.component';
import { RoleDetailComponent } from './components/role/role-detail/role-detail.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { CameraComponent } from './components/camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { DashboardManagementComponent } from './components/dashboard-management/dashboard-management.component';
import { DashboardEmployeeComponent } from './components/dashboard-employee/dashboard-employee.component';
import { PortfolioViewComponent } from './components/portfolio/portfolio-view/portfolio-view.component';
import { PortfolioAddComponent } from './components/portfolio/portfolio-add/portfolio-add.component';
import { PortfolioEditComponent } from './components/portfolio/portfolio-edit/portfolio-edit.component';
import { PortfolioDetailComponent } from './components/portfolio/portfolio-detail/portfolio-detail.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    AutoFocusDirective,
    SortableDirective,
    DatePipe,
    TimePipe,
    NumberPipe,
    HaveKeysPipe,
    FilterPipe,
    MePipe,
    NowPipe,
    DashboardComponent,
    LoginComponent,
    AvatarComponent,
    AccountComponent,
    BreadcrumbComponent,
    NavbarComponent,
    SidenavComponent,
    MenuViewComponent,
    MenuAddComponent,
    MenuEditComponent,
    UserViewComponent,
    UserAddComponent,
    UserEditComponent,
    RoleViewComponent,
    RoleAddComponent,
    RoleEditComponent,
    RoleDetailComponent,
    UserDetailComponent,
    CameraComponent,
    DashboardManagementComponent,
    DashboardEmployeeComponent,
    PortfolioViewComponent,
    PortfolioAddComponent,
    PortfolioEditComponent,
    PortfolioDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxDaterangepickerMd.forRoot(),
    NgSelectModule,
    WebcamModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
    NgxNumberFormatModule,
    NgxPrintModule,
    LightboxModule,
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HTTPInterceptorService,
        multi: true
    }
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
