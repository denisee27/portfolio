import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private location: Location,
        public loading: LoadingService,
    ) {
        this.route.params.subscribe(e => {
            this.id = e.id;
        });
    }
    private apiPath = 'users';
    id: any;
    data: any = {};

    back(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.http.Get(this.apiPath + '/' + this.id, {}).then((r: any) => {
            if (r.success && r?.response?.result?.data?.id) {
                this.data = r?.response?.result?.data;
            } else {
                this.back();
            }
        });

    }

}


