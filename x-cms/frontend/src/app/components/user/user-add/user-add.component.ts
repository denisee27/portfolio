import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
    constructor(
        private http: HttpService,
        private el: ElementRef,
        private location: Location,
        public loading: LoadingService,
        private toastr: ToastrService
    ) { }
    @ViewChild('theForm') theForm: NgForm | undefined;
    private apiPath = 'users';
    stayPage: boolean = false;
    formGroup = new FormGroup({
        role_id: new FormControl(),
        name: new FormControl(),
        nik: new FormControl(),
        email: new FormControl(),
        phone: new FormControl(),
        password: new FormControl(),
        status: new FormControl(1),
    });
    formChanged = false;
    roleList: any = [];

    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        form.disable();
        form.value.status = Number(form.value.status);
        let fdata = new FormData();
        fdata.append('data', JSON.stringify(form.value));
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

    async getRole(): Promise<void> {
        const r = await this.http.Get('roles', { filter: { status: 1 }, forceView: true });
        this.roleList = r.response?.result?.data || [];
    }

    ngOnInit(): void {
        const oldValue = this.formGroup.value;
        this.formGroup.valueChanges.subscribe((e: any) => {
            this.formChanged = (oldValue != e);
        });
        this.getRole();
    }

}
