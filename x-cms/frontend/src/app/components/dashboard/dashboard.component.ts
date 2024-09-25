import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    constructor(
        private http: HttpService,
        private auth: AuthService,
        public loading: LoadingService
    ) { }
    private apiPath = 'dashboard';
    canAccess: any | null = null;
    dashboardLoading = true;
    userData: any = {};
    activeTab: any = 1;

    async checkAccess(): Promise<void> {
        const r = await this.http.Get(this.apiPath, { forceView: true });
        this.canAccess = r.response?.result || null;
        this.dashboardLoading = false;
    }

    async ngOnInit(): Promise<void> {
        this.userData = this.auth.userData;
        await this.checkAccess();
    }
}
