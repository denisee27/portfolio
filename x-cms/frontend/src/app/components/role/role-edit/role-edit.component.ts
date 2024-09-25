import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileHandlerService } from 'src/app/services/file-handler.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private location: Location,
        public fileHandler: FileHandlerService,
        public loading: LoadingService,
        private el: ElementRef,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        this.route.params.subscribe(e => {
            this.id = e.id;
        });
    }
    private apiPath = 'roles';
    id: any;
    @ViewChild('theForm') theForm: NgForm | undefined;
    formGroup = this.fb.group({});
    formChanged = false;
    navList: any = [];
    selNav: any = [];
    dashboard: any = {};
    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }

        form.value.access = this.selNav;
        form.value.status = Number(form.value.status);
        form.value.allow_mobile_login = Number(form.value.allow_mobile_login);
        form.value.dashboard = this.dashboard || {};
        let fdata = new FormData();
        fdata.append('data', JSON.stringify(form.value));
        form.disable();
        this.http.Post(this.apiPath + '/update', fdata).then((r: any) => {
            form.enable();
            if (r.success) {
                this.toastr.success('Data saved successfully', 'Success');
                this.back();
            } else {
                if (r.response && r.response.wrong) {
                    Object.keys(r.response.wrong).forEach((key) => {
                        form.get(key)?.setErrors({ serverError: r.response.wrong[key][0] });
                        this.el.nativeElement.querySelectorAll('[formcontrolname="' + key + '"]')?.[0]?.focus();
                    });
                }
            }
        });
    }

    back(): void {
        this.location.back();
    }

    async getNav(): Promise<void> {
        const r = await this.http.Get('navigations', { filter: { status: 1 }, forceView: true });
        this.navList = r?.response?.result?.data || [];
    }

    getRootNav(): any {
        return this.navList.filter((e: any) => !e.parent_id);
    }

    ngOnInit(): void {
        this.http.Get(this.apiPath + '/' + this.id, {}).then((r: any) => {
            if (r.success && r?.response?.result?.data?.id) {
                this.getNav();
                this.selNav = r.response.result.data?.access;
                if (JSON.stringify(r.response?.result?.data?.dashboard_access) == '[]') {
                    this.dashboard = {};
                } else {
                    this.dashboard = r.response?.result?.data?.dashboard_access || {};
                }
                console.log(this.dashboard);
                Object.keys(r?.response?.result?.data).forEach((key) => {
                    if (key != 'dashboard_access') {
                        this.formGroup.addControl(key, new FormControl(r?.response?.result?.data[key]));
                    }
                });
            } else {
                this.back();
            }
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
