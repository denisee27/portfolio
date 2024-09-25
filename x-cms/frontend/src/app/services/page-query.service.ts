import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PageQueryService {

    constructor(private router: Router, private activeRoute: ActivatedRoute) {
        this.activeRoute.queryParams.subscribe((e: any) => {
            Object.keys(e).forEach((v: any) => {
                this.queryPage[v] = e[v];
            });
            this.isSearch = this.queryPage.q;
            this.changeQuery(this.queryPage);
        });
    }
    isSearch: boolean = false;
    queryPage: any = {
        q: null,
        limit: 10,
        page: 1
    };
    query: BehaviorSubject<any> = new BehaviorSubject(this.queryPage);

    init(callback?: Function): void {
        if (this.query.closed) {
            this.query = new BehaviorSubject(this.queryPage);
        }
        this.query.subscribe((e: any) => {
            this.queryPage = e;
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    };

    destroy(): void {
        this.isSearch = false;
        this.queryPage = {
            q: null,
            limit: 10,
            page: 1
        };
        this.query.complete();
        this.query.unsubscribe();
    }

    searchData(ev: any): void {
        if (ev?.keyCode === 27) {
            this.changeRoute({ page: 1, q: '' });
            this.isSearch = false;
            this.queryPage.q = null;
        }
        if (ev?.keyCode === 13) {
            this.changeRoute({ page: 1, q: this.queryPage.q });
        }
    }

    private changeQuery(q: any): void {
        if (this.query.closed) {
            return;
        }
        this.query.pipe(take(1)).subscribe((e: any) => {
            Object.keys(q || {}).forEach((key) => {
                e[key] = q[key];
            });
            this.query.next(e);
        });
    }

    changeRoute(params: any): void {
        this.router.navigate([(this.router.url).split('?')[0]], {
            relativeTo: this.activeRoute,
            queryParams: params,
            queryParamsHandling: 'merge',
        });
    }
}
