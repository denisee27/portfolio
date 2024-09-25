import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-menu-edit',
    templateUrl: './menu-edit.component.html',
    styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private location: Location,
        private nav: NavigationService,
        public loading: LoadingService,
        private el: ElementRef,
        private fb: FormBuilder
    ) {
        this.route.params.subscribe(e => {
            this.id = e.id;
        });
    }
    private apiPath = 'navigations';
    id: any;
    @ViewChild('theForm') theForm: NgForm | undefined;
    formGroup = this.fb.group({});
    parentList: any = [];
    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        form.disable();
        let fdata = new FormData();
        fdata.append('id', this.id);
        fdata.append('data', JSON.stringify(form.value));
        this.http.Post(this.apiPath + '/update', fdata).then((r: any) => {
            form.enable();
            if (r.success) {
                this.nav.getNav();
                this.back();
            }
        });
    }

    getParent(): void {
        this.http.Get(this.apiPath, { filter: { status: 1 } }).then((r: any) => {
            if (r.success) {
                this.parentList = r?.response?.result?.data || [];
            }
        });
    }

    back(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.http.Get(this.apiPath + '/' + this.id, {}).then((r: any) => {
            if (r.success && r?.response?.result?.data?.id) {
                Object.keys(r?.response?.result?.data).forEach((key) => {
                    let val = (key == 'action') ? (r?.response?.result?.data[key])?.join(',') : r?.response?.result?.data[key];
                    this.formGroup.addControl(key, new FormControl(val));
                });
                this.getParent();
            } else {
                this.back();
            }
        });
    }

}
