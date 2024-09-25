import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptService } from './encrypt.service';
import { LoadingService } from './loading.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router, private loading: LoadingService) { }

    isTimeOut: Subject<boolean> = new Subject<boolean>();
    private apiUrl = environment.apiUrl;
    private timeout: any = null;

    private HttpHeaders = new HttpHeaders({
        Accept: 'application/json',
    });

    private HttpOptions: any = {
        headers: this.HttpHeaders,
        responType: 'json',
        reportProgress: true
    };

    private cekAuth(): any {
        const cookie = localStorage.getItem('_' + environment.appName + '.globals') || null;
        if (!cookie) {
            return null;
        }
        try {
            let encParse = JSON.parse(EncryptService.decrypt(cookie)) || null;
            return encParse;
        } catch (e) {
            return null;
        }
    }

    isLoggedIn(): boolean {
        const authData = this.cekAuth();
        if (authData === null) {
            return false;
        }
        if (!authData.token_type) {
            return false;
        }
        if (!authData.user) {
            return false;
        }
        if (authData.user && authData.user.email) {
            return true;
        } else {
            return false;
        }
    }

    reload(): void {
        this.loading.start();
        let authData = this.cekAuth() || {};
        const headers = this.HttpHeaders.append('Authorization', authData.token_type + ' ' + authData.access_token);
        this.HttpOptions.headers = headers;
        this.http.get(this.apiUrl + '/auth/profile', this.HttpOptions)
            .toPromise()
            .then((e: any) => {
                const user = e.result;
                this.userData = user;
            })
            .finally(() => {
                this.loading.done();
            });
    }

    logout(NoRedirect = false, direct = false): any {
        clearTimeout(this.timeout);
        if (direct) {
            localStorage.removeItem('_' + environment.appName + '.globals');
            if (!NoRedirect) {
                this.router.navigate(['login']);
            }
            return;
        }
        this.loading.start();
        const authToken = this.cekAuth() || {};
        const headers = this.HttpHeaders.append('Authorization', authToken.token_type + ' ' + authToken.access_token);
        this.HttpOptions.headers = headers;
        return this.http.get(this.apiUrl + '/auth/logout', this.HttpOptions)
            .toPromise()
            .then(() => { return true; })
            .catch(() => { return true; })
            .finally(() => {
                localStorage.removeItem('_' + environment.appName + '.globals');
                if (!NoRedirect) {
                    this.router.navigate(['login']);
                }
                this.loading.done();
            });
    }

    login(email: string, password: string, keepLogin = false): any {
        this.loading.start();
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);
        if (keepLogin) {
            data.append('keepLogin', 'true');
        }
        return this.http.post(this.apiUrl + '/auth/login', data, this.HttpOptions)
            .toPromise()
            .then((resp: any) => {
                this.saveAuth(resp.result);
                return { success: true };
            }).catch((err) => {
                return { success: false, response: err.error };
            })
            .finally(() => {
                this.loading.done();
            });
    }

    forgotPassword(email: string): any {
        this.loading.start();
        const data = new FormData();
        data.append('email', email);
        return this.http.post(this.apiUrl + '/auth/forgot-password', data, this.HttpOptions)
            .toPromise()
            .then(() => {
                return { success: true };
            }).catch((err) => {
                return { success: false, response: err.error };
            })
            .finally(() => {
                this.loading.done();
            });
    }

    signUp(data: FormData): any {
        this.loading.start();
        return this.http.post(this.apiUrl + '/auth/login', data, this.HttpOptions)
            .toPromise()
            .finally(() => {
                this.loading.done();
            });
    }

    get userData(): any {
        if (!this.isLoggedIn()) {
            return null;
        }
        const authData = this.cekAuth();
        return authData.user;
    }

    set userData(userData: any) {
        const authData = this.cekAuth();
        if (authData) {
            authData.user = userData;
            const newAuthData = EncryptService.encrypt(JSON.stringify(authData));
            localStorage.setItem('_' + environment.appName + '.globals', newAuthData);
        }
    }

    get tokenData(): any {
        if (!this.isLoggedIn()) {
            return null;
        }
        const authData = this.cekAuth();
        delete authData.user;
        return authData;
    }

    set tokenData(tokenData: any) {
        const authData = this.cekAuth();
        if (!authData) {
            return;
        }
        let newAuthData: any = tokenData || {};
        newAuthData.user = authData.user;
        const encryptAuth = EncryptService.encrypt(JSON.stringify(newAuthData));
        localStorage.setItem('_' + environment.appName + '.globals', encryptAuth);
    }

    saveAuth(authData: any): void {
        const date = new Date();
        date.setSeconds(date.getSeconds() + authData.timeout);
        authData.expires = date.getTime();
        const encAuth = EncryptService.encrypt(JSON.stringify(authData));
        localStorage.setItem('_' + environment.appName + '.globals', encAuth);
        delete authData.user;
        this.refreshTimeout(authData);
    }

    checkTimeout(): boolean {
        const authData = this.tokenData;
        if (!authData) {
            this.isTimeOut.next(true);
            return true;
        }
        const current_time = (new Date()).getTime();
        const auth_expires = authData.expires;
        const isTimeOut = current_time > auth_expires;
        if (isTimeOut) {
            this.isTimeOut.next(true);
        }
        return isTimeOut;
    }

    refreshTimeout(tokenData?: any): void {
        const authData = tokenData ? tokenData : this.tokenData;
        clearTimeout(this.timeout);
        if (!authData) {
            return;
        }
        const date = new Date();
        date.setSeconds(date.getSeconds() + authData.timeout);
        authData.expires = date.getTime();
        this.tokenData = authData;
        this.isTimeOut.next(false);
        this.timeout = setTimeout(() => {
            this.isTimeOut.next(true);
        }, authData.timeout * 1000);
    }
}
