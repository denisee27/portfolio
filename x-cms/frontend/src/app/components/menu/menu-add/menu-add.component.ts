import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-menu-add',
    templateUrl: './menu-add.component.html',
    styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent implements OnInit {

    constructor(
        private http: HttpService,
        private el: ElementRef,
        private nav: NavigationService,
        private location: Location,
        public loading: LoadingService) { }
    @ViewChild('theForm') theForm: NgForm | undefined;
    private apiPath = 'navigations';
    parentList: any = [];
    stayPage: boolean = false;
    formGroup = new FormGroup({
        parent_id: new FormControl(),
        name: new FormControl(),
        icon: new FormControl(),
        link: new FormControl(),
        action: new FormControl(),
        position: new FormControl(),
        status: new FormControl(1)
    });

    submitForm(form: any): void {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')[0].focus();
            return;
        }
        form.disable();
        let fdata = new FormData();
        fdata.append('data', JSON.stringify(form.value));
        this.http.Post(this.apiPath + '/create', fdata).then((r: any) => {
            form.enable();
            if (r.success) {
                this.nav.getNav();
                if (this.stayPage) {
                    const status = form.value?.status;
                    form?.reset();
                    this.theForm?.resetForm();
                    form.get('status')?.setValue(status);
                    this.getParent();
                } else {
                    this.back();
                }
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
        this.getParent();
    }

}
