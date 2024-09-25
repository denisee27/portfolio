import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError, timer } from 'rxjs';
import { finalize, retry, timeout } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class HTTPInterceptorService implements HttpInterceptor {

    constructor(
        private auth: AuthService
    ) { }

    private checkTimeout = true;

    private shouldRetry(error: HttpErrorResponse) {
        if (error.status === 409 || error.status == 0) {
            return timer(200);
        }
        return throwError(() => error);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let httpHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        let httpOptions: any = {
            headers: httpHeaders,
            responseType: 'json',
            reportProgress: true
        };
        if (req.url.indexOf('auth/login') > -1) {
            const _req = req.clone(httpOptions);
            return next.handle(_req);
        }
        httpOptions.headers = httpHeaders.append('Authorization', this.getToken());
        const _req = req.clone(httpOptions);
        if (req.url.indexOf('auth/refresh') > -1 || req.url.indexOf('auth/logout') > -1) {
            this.checkTimeout = false;
        }

        if (this.checkTimeout && this.auth.checkTimeout()) {
            return EMPTY;
        }

        return next.handle(_req).pipe(
            timeout(30000),
            retry({ count: 2, delay: this.shouldRetry }),
            finalize(() => this.checkTimeout && this.auth.refreshTimeout())
        )
    }

    private getToken(): string {
        const tokenData = this.auth.tokenData || {};
        return tokenData.token_type + ' ' + tokenData.access_token;
    }
}
