import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileHandlerService } from 'src/app/services/file-handler.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-role-detail',
    templateUrl: './role-detail.component.html',
    styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private location: Location,
        public fileHandler: FileHandlerService,
        public loading: LoadingService,
    ) {
        this.route.params.subscribe(e => {
            this.id = e.id;
        });
    }
    private apiPath = 'roles';
    id: any;
    @ViewChild('theForm') theForm: NgForm | undefined;
    data: any = {};
    navList: any = [];
    selNav: any = [];
    rootNav: any[] = [];
    dashboard: any = {};

    back(): void {
        this.location.back();
    }

    getNav(): void {
        this.http.Get('navigations', { filter: { status: 1 }, forceView: true }).then((r: any) => {
            if (r.success) {
                const cData = r?.response?.result?.data || [];
                this.navList = cData;
                this.rootNav = this.navList.filter((e: any) => !e.parent_id);
            }
        });
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

    isPermissionChecked(permission: any, link: any): boolean {
        const e = this.selNav.findIndex((c: any) => c.link === link);
        if (e < 0) return false;
        return this.selNav[e][permission];
    }

    ngOnInit(): void {
        this.http.Get(this.apiPath + '/' + this.id, {}).then((r: any) => {
            if (r.success && r?.response?.result?.data?.id) {
                this.getNav();
                this.data = r.response?.result?.data
                this.selNav = this.data.access;
            } else {
                this.back();
            }
        });

    }

}
