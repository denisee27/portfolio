import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private http: HttpService) { }
    public isLoading: boolean = false;
    public navData = new Subject<any>();

    getNav(): void {
        this.isLoading = true;
        this.http.Get('auth/nav', null, true).then((r: any) => {
            this.isLoading = false;
            if (r.success) {
                this.navData.next(r.response?.result?.data || []);
            } else {
                this.navData.next([]);
            }
        });
    }
}
