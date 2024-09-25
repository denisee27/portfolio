import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        public loading: LoadingService,
        private title: Title,
        private toastr: ToastrService,
        private el: ElementRef) {
    }
    loginForm = new FormGroup({
        email: new FormControl(null),
        password: new FormControl(null)
    });

    submitForm(loginForm: any): void {
        if (!loginForm.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0].focus();
            return;
        }
        loginForm.disable();
        this.auth.login(loginForm.value.email, loginForm.value.password).then((res: any) => {
            if (res.success) {
                const returnUrl = this.route.snapshot.queryParams['return'] || '/';
                this.router.navigateByUrl(returnUrl);
            } else {
                loginForm.enable();
                if (res.response && res.response.wrong) {
                    Object.keys(res.response.wrong).forEach((key) => {
                        loginForm.get(key)?.setErrors({ serverError: res.response.wrong[key][0] });
                        this.el.nativeElement.querySelectorAll('[formcontrolname="' + key + '"]')?.[0]?.focus();
                    });
                    return;
                }
                const title = res.response?.message || 'Oops';
                const desc = res.response?.description || 'Unknown Error';
                this.toastr.error(desc, title);
            }
        });
    }

    ngOnInit(): void {
        this.title.setTitle('Login | WIS');
    }

}
