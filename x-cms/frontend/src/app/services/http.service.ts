import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private loading: LoadingService,
        private toastr: ToastrService) {
    }

    private apiUrl = environment.apiUrl;

    private handleError(err: any): void {
        let err_description = '';
        if (err.status == 401) {
            err_description = 'Authorization invalid, please re-login';
            if (environment.production) {
                this.auth.logout(false, true);
            }
        } else if (err.status == 0) {
            err_description = 'No Internet connection, please check your connection & try again later';
        } else if (err.status == 500 && environment.production) {
            err_description = 'Something went wrong, please try again later';
        } else {
            if (err.error?.wrong) {
                err_description = typeof (err.error.wrong) == 'object' ? Object.values(err.error.wrong).join('<br>') : (err.error.wrong).toString();
            } else {
                err_description = err.error?.description || err.error?.message || 'Unknown Error. Please contact Administrator';
            }
            if (err.status == 423) {
                this.auth.logout(false, true);
            }
        }
        const error = {
            title: environment.production ? 'Oops!' : err.statusText,
            message: err_description
        };
        this.toastr.error(error.message, error.title, { enableHtml: true });
    }

    async Get(urlPath: string, params?: any, noLoading?: boolean): Promise<{ success: boolean, response: any, permission: any }> {
        if (!noLoading) {
            this.loading.start();
        }
        let httpOptions: any = {};
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                if (!params[key]) {
                    return;
                }
                const val = typeof (params[key]) == 'object' ? JSON.stringify(params[key]) : params[key];
                httpParams = httpParams.append(key, val);
            });
            httpOptions.params = httpParams;
        }
        httpOptions.observe = 'response';
        return this.http.get(this.apiUrl + '/' + urlPath, httpOptions)
            .toPromise()
            .then((resp: any) => {
                let permission = resp?.headers?.get('x-access');
                permission = permission ? JSON.parse(atob(permission) || '{}') : {};
                return { success: true, response: (resp?.body || {}), permission: permission };
            })
            .catch((err) => {
                this.handleError(err);
                return { success: false, response: err.error };
            })
            .finally(() => {
                if (!noLoading) {
                    setTimeout(() => {
                        this.loading.done();
                    }, 200);
                }
            }) as Promise<{ success: boolean, response: any, permission: any }>;
    }

    async Post(urlPath: string, data: object = {}, noLoading?: boolean): Promise<{ success: boolean, response: any }> {
        if (!noLoading) {
            this.loading.start();
        }
        const httpOptions: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(this.apiUrl + '/' + urlPath, data, httpOptions)
            .toPromise()
            .then((resp) => {
                return { success: true, response: resp };
            })
            .catch((err) => {
                this.handleError(err);
                return { success: false, response: err.error };
            })
            .finally(() => {
                if (!noLoading) {
                    setTimeout(() => {
                        this.loading.done();
                    }, 200);
                }
            }) as Promise<{ success: boolean, response: any }>;
    }

    async PostFile(urlPath: string, fdata: FormData, noLoading?: boolean): Promise<{ success: boolean, response: any }> {
        if (!noLoading) {
            this.loading.start();
        }
        return this.http.post(this.apiUrl + '/' + urlPath, fdata)
            .toPromise()
            .then((resp) => {
                return { success: true, response: resp };
            })
            .catch((err) => {
                this.handleError(err);
                return { success: false, response: err.error };
            })
            .finally(() => {
                if (!noLoading) {
                    setTimeout(() => {
                        this.loading.done();
                    }, 200);
                }
            }) as Promise<{ success: boolean, response: any }>;
    }

    async Delete(urlPath: string, data: Array<any>, noLoading?: boolean): Promise<{ success: boolean, response: any }> {
        if (!noLoading) {
            this.loading.start();
        }
        return this.http.delete(this.apiUrl + '/' + urlPath, { body: data })
            .toPromise()
            .then((resp) => {
                return { success: true, response: resp };
            })
            .catch((err) => {
                this.handleError(err);
                return { success: false, response: err.error };
            })
            .finally(() => {
                if (!noLoading) {
                    setTimeout(() => {
                        this.loading.done();
                    }, 200);
                }
            }) as Promise<{ success: boolean, response: any }>;
    }
}
