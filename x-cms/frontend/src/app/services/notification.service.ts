import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpService) { }
    public count: number = 0;
    public list: any[] = [];
    public isLoading: boolean = false;

    getCount(): void {
        this.http.Get('notifications/count', {}, true).then((r: any) => {
            if (r.success) {
                this.count = r.response?.result || 0;
            }
        });
    }

    getList(): void {
        if (!this.list.length) {
            this.isLoading = true;
        }
        this.http.Get('notifications', {}, true).then((r: any) => {
            if (r.success) {
                this.list = r.response?.result?.data || [];
                this.isLoading = false;
            }
        });
    }

    read(id?: string): void {
        if (id) {
            this.list.forEach((e: any) => {
                if (e.id == id) {
                    e.is_read = 1;
                }
            });
            this.count--;
        } else {
            this.list.forEach((e: any) => {
                e.is_read = 1;
            });
            this.count = 0;
        }
        let fdata = new FormData();
        fdata.append('id', (id || ''));
        this.http.Post('notifications/read', fdata).then(() => { });
    }
}
