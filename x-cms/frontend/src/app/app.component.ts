import { Component, OnInit, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { SidenavService } from './services/sidenav.service';
import { HttpService } from './services/http.service';
import { NavigationService } from './services/navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked  {
  constructor(
    public loading: LoadingService,
    public sidenav: SidenavService,
    private navService: NavigationService,
    private http: HttpService,
    private el: ElementRef,
    public auth: AuthService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private lightBox: Lightbox,
    private lightboxConfig: LightboxConfig,
    private title: Title) {
    this.lightboxConfig.disableScrolling = true;
    this.lightboxConfig.centerVertically = true;
    this.lightboxConfig.showImageNumberLabel = true;
    this.lightboxConfig.alwaysShowNavOnTouchDevices = true;
}

loginForm = new FormGroup({
    password: new FormControl(null),
});
userEmail: string | null = null;
userData = this.auth.userData || {};

isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
}

submitLogin(form: FormGroup): void {
    if (!form.valid) {
        this.el.nativeElement.querySelectorAll('.auth-form [formcontrolname].ng-invalid')[0]?.focus();
        return;
    }
    let fdata = new FormData();
    fdata.append('password', form.value?.password);
    form.disable();
    this.http.Post('auth/refresh', fdata).then((r: any) => {
        form.enable();
        if (r.success) {
            this.loginForm.reset();
            const data = r?.response?.result || {};
            this.auth.refreshTimeout(data);
            this.navService.getNav();
            if (this.router.url == '/dashboard') {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate([this.router.url]);
                });
            }
        } else {
            if (r.response && r.response.wrong) {
                Object.keys(r.response.wrong).forEach((key) => {
                    form.get(key)?.setErrors({ serverError: r.response.wrong[key][0] });
                    this.el.nativeElement.querySelectorAll('.auth-form [formcontrolname="' + key + '"]')?.[0]?.focus();
                });
            }
        }
    });
}

authLogout(): void {
    this.auth.logout(false, true);
}

ngOnInit(): void {
    if (this.isLoggedIn()) {
        this.title.setTitle('Home | Profile CMS');
    } else {
        this.title.setTitle('Login | Profile CMS');
    }
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.modalService.dismissAll();
            this.lightBox.close();
        }
    });
}

ngAfterViewChecked(): void {
    this.cdr.detectChanges();
}
}
