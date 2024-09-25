import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    constructor(
        private toastr: ToastrService,
        private auth: AuthService,
        private el: ElementRef,
        public loading: LoadingService,
        private http: HttpService) { }

    stayPage: boolean = false;
    profileGroup = new FormGroup({
        name: new FormControl(),
        phone: new FormControl(),
    });
    passwordGroup = new FormGroup({
        password: new FormControl(),
        new_password: new FormControl(),
        new_password_confirmation: new FormControl()
    });
    userData: any = {};
    view = 0;

    updateProfile(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        form.disable();
        this.http.Post('auth/update-profile', form.value).then((r: any) => {
            form.enable();
            if (r.success) {
                this.auth.userData = r.response.result;
                this.toastr.success('Profile updated successfully', 'Success');
                location.reload();
            } else {
                if (r.response && r.response.wrong) {
                    Object.keys(r.response.wrong).forEach((key) => {
                        if (key != 'id') {
                            form.get(key)?.setErrors({ serverError: r.response.wrong[key][0] });
                            this.el.nativeElement.querySelectorAll('[formcontrolname="' + key + '"]')?.[0]?.focus();
                        }
                    });
                }
            }
        });
    }

    changePassword(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        form.disable();
        this.http.Post('auth/change-password', form.value).then((r: any) => {
            form.enable();
            if (r.success) {
                this.toastr.success('Password changed successfully', 'Success');
                this.view = 0;
            } else {
                if (r.response && r.response.wrong) {
                    Object.keys(r.response.wrong).forEach((key) => {
                        if (key != 'id') {
                            form.get(key)?.setErrors({ serverError: r.response.wrong[key][0] });
                            this.el.nativeElement.querySelectorAll('[formcontrolname="' + key + '"]')?.[0]?.focus();
                        }
                    });
                }
            }
        });
    }

    ngOnInit(): void {
        this.userData = this.auth.userData;
        this.profileGroup.get('name')?.setValue(this.userData.name);
        this.profileGroup.get('phone')?.setValue(this.userData.phone);
    }
}
