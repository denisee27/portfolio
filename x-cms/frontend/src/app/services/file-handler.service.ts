import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class FileHandlerService {

    constructor(private toastr: ToastrService) { }
    handle(ev: any, varname: any, type: any, maxSize?: number, minImageWidth?: number, minImageHeight?: number, minImageRatio?: number, maxImageRatio?: number): void {
        if (!ev.target?.files?.length) {
            ev.target.value = '';
            varname.file = null;
            varname.view = null;
            varname.loading = false;
            return;
        }
        const parseFile = (file: any, varname: any): any => {
            return new Promise((resolve: any) => {
                const allowedFileType = type.split(',');
                if (allowedFileType.indexOf(file?.type) < 0) {
                    ev.target.value = '';
                    varname.file = null;
                    varname.view = null;
                    varname.loading = false;
                    this.toastr.error('File type not allowed', 'Oops');
                    resolve(false);
                    return;
                }
                var mbSize = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                if (maxSize && (mbSize > maxSize)) {
                    ev.target.value = '';
                    varname.file = null;
                    varname.view = null;
                    varname.loading = false;
                    this.toastr.error(`File size not allowed, max. ${maxSize}MB`, 'Oops');
                    resolve(false);
                    return;
                }
                if (file?.type && (file.type).toString().substr(0, 5) === 'image') {
                    varname.loading = true;
                    const checkDimension = (e: any) => {
                        const img = new Image();
                        img.onload = () => {
                            const maxRes = img.width >= (minImageWidth || 0) && img.height >= (minImageHeight || 0);
                            const maxRatio = (img.width / img.height >= (minImageRatio || 0)) && (img.width / img.height <= (maxImageRatio || 0));
                            if (!maxRes && !maxRatio) {
                                ev.target.value = '';
                                varname.file = null;
                                varname.view = null;
                                varname.loading = false;
                                this.toastr.error(`Image resolution not allowed`, 'Oops');
                                img.remove();
                                resolve(false);
                            } else {
                                varname.file = file;
                                varname.view = img.src;
                                varname.loading = false;
                                img.remove();
                                resolve(true);
                            }
                        };
                        img.onerror = () => {
                            ev.target.value = '';
                            varname.file = null;
                            varname.view = null;
                            varname.loading = false;
                            this.toastr.error(`Failed to load image`, 'Oops');
                            img.remove();
                            resolve(false);
                        };
                        img.src = e;
                    };
                    const fReader = new FileReader();
                    fReader.onloadend = (e) => {
                        const src = e.target?.result as string;
                        if ((minImageWidth && minImageHeight) || (minImageRatio && maxImageRatio)) {
                            checkDimension(src);
                        } else {
                            varname.file = file;
                            varname.view = src;
                            varname.loading = false;
                            resolve(true);
                        }
                    };
                    fReader.onerror = () => {
                        ev.target.value = '';
                        varname.file = null;
                        varname.view = null;
                        varname.loading = false;
                        this.toastr.error('Failed to read file', 'Oops');
                        resolve(false);
                    };
                    fReader.readAsDataURL(file);
                } else {
                    varname.file = file;
                    varname.view = ((file.name).length > 15 ? (file.name).substr(0, 5) + '...' + (file.name).substr((file.name).length - 10) : file.name);
                    varname.loading = false;
                    resolve(true);
                }
            });
        };
        const isMultiple = ev.target.getAttribute('multiple');
        if (typeof (isMultiple) === 'object' && isMultiple === null) {
            const file = ev?.target?.files[0];
            parseFile(file, varname).then(() => { });
        } else {
            const files = ev?.target?.files || [];
            Array.from(files).forEach((file: any) => {
                varname.push({ file: null, view: null });
                parseFile(file, varname[varname.length - 1]).then((e: any) => {
                    if (!e) {
                        varname.splice(varname.length - 1, 1);
                    }
                });
            });
        }
    }
}
