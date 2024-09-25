import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-role-add',
    templateUrl: './role-add.component.html',
    styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
    constructor(
        private http: HttpService,
        private el: ElementRef,
        private location: Location,
        public loading: LoadingService,
        private toastr: ToastrService) { }
    @ViewChild('theForm') theForm: NgForm | undefined;
    private apiPath = 'roles';
    parentList: any = [];
    stayPage: boolean = false;
    formGroup = new FormGroup({
        name: new FormControl(),
        access: new FormControl([]),
        status: new FormControl(1),
        allow_mobile_login: new FormControl(0)
    });
    formChanged = false;
    navList: any = [];
    selNav: any = [];
    dashboard: any = {};

    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        this.formGroup.get('access')?.setValue(this.selNav);
        form.value.access = this.selNav;
        form.value.status = Number(form.value.status);
        form.value.allow_mobile_login = Number(form.value.allow_mobile_login);
        form.value.dashboard = this.dashboard || {};
        let fdata = new FormData();
        fdata.append('data', JSON.stringify(form.value));
        form.disable();
        this.http.Post(this.apiPath + '/create', fdata).then((r: any) => {
            form.enable();
            if (r.success) {
                this.toastr.success('Data saved successfully', 'Success');
                this.back();
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

    back(): void {
        this.location.back();
    }

    getNav(): void {
        this.http.Get('navigations', { filter: { status: 1 }, forceView: true }).then((r: any) => {
            if (r.success) {
                const cData = r?.response?.result?.data || [];
                this.navList = cData;
            }
        });
    }

    getRootNav(): any {
        return this.navList.filter((e: any) => !e.parent_id);
    }

    ngOnInit(): void {
        this.getNav();
        const oldValue = this.formGroup.value;
        this.formGroup.valueChanges.subscribe((e: any) => {
            this.formChanged = (oldValue != e);
        });
    }

    toggleRootMenu(n: any) {
        if (this.isRootMenuChecked(n)) {
            (n || []).forEach((c: any) => {
                const x = this.selNav.findIndex((el: any) => c.link === el.link);
                if (x > -1) {
                    this.selNav.splice(x, 1);
                }
            });
        } else {
            (n || []).forEach((c: any) => {
                this.toggleMenu(c);
            });
        }
    }

    isParentChecked(n: any): boolean {
        return this.selNav.findIndex((c: any) => c.link === n.link) > -1;
    }

    isRootMenuChecked(n: any): boolean {
        let x = 0;
        this.selNav.forEach((c: any) => {
            x += (n || []).filter((el: any) => el.link === c.link).length;
        });
        return (x > 0);
    }

    isMenuChecked(m: any): boolean {
        return this.selNav.findIndex((c: any) => c.link === m.link) > -1;
    }

    toggleMenu(t: any): void {
        const x = this.selNav.findIndex((c: any) => c.link === t.link);
        if (x > -1) {
            this.selNav.splice(x, 1);
        } else {
            const n = { link: t.link }
            this.selNav.push(n);
        }
    }

    isPermissionChecked(permission: any, link: any): boolean {
        const e = this.selNav.findIndex((c: any) => c.link === link);
        if (e < 0) return false;
        return this.selNav[e][permission];
    }

    togglePermission(permission: any, link: any): void {
        const e = this.selNav.findIndex((c: any) => c.link === link);
        if (this.selNav[e] && this.selNav[e][permission]) {
            delete this.selNav[e][permission];
        } else {
            this.selNav[e][permission] = true;
        }
    }

}
