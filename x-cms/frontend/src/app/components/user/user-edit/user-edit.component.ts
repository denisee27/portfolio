import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileHandlerService } from 'src/app/services/file-handler.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

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
    private apiPath = 'users';
    id: any;
    @ViewChild('theForm') theForm: NgForm | undefined;
    formGroup = this.fb.group({});
    formChanged = false;
    roleList: any = [];

    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }

        let fdata = new FormData();
        form.value.status = Number(form.value.status);
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

    async getRole(): Promise<void> {
        const r = await this.http.Get('roles', { filter: { status: 1 }, forceView: true });
        this.roleList = r.response?.result?.data || [];
    }

    ngOnInit(): void {
        this.http.Get(this.apiPath + '/' + this.id, {}).then((r: any) => {
            if (r.success && r?.response?.result?.data?.id) {
                this.getRole();
                Object.keys(r?.response?.result?.data).forEach((key) => {
                    this.formGroup.addControl(key, new FormControl(r?.response?.result?.data[key]));
                });
                this.formGroup.addControl('password', new FormControl());
            } else {
                this.back();
            }
        });

    }

}

