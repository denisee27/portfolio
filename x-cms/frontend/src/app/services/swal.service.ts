import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class swal {

    static show(option: swalOption): Observable<any> {
        let _options: any = {
            title: option.message,
            showCancelButton: true,
            confirmButtonText: option.confirmButton || 'Ok',
            cancelButtonText: option.cancelButton || 'Cancel',
            focusCancel: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary mx-1',
                cancelButton: 'btn btn-danger mx-1',
                loader: 'custom-loader'
            },
            loaderHtml: '<div class="spinner-border text-primary"></div>'
        };
        if (option.type) {
            _options.icon = option.type;
        }
        return from(Swal.fire(_options));
    }

}

export interface swalOption {
    message: string,
    type?: SweetAlertIcon | null,
    confirmButton?: string,
    cancelButton?: string
}
