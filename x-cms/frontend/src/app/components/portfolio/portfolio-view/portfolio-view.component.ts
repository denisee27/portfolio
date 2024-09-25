import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PageQueryService } from 'src/app/services/page-query.service';

@Component({
  selector: 'app-portfolio-view',
  templateUrl: './portfolio-view.component.html',
  styleUrls: ['./portfolio-view.component.scss']
})
export class PortfolioViewComponent implements OnInit, OnDestroy {
  constructor(
    public pageQuery: PageQueryService,
    public loading: LoadingService,
    private auth: AuthService,
    private http: HttpService,
    private el: ElementRef,
    private modalService: NgbModal,
    private toastr: ToastrService
) {
    this.loading.start();
}
@ViewChild('theForm') theForm: NgForm | undefined;
@ViewChild('editor', { static: false }) editorElement!: ElementRef; // Gunakan ElementRef untuk mendapatkan elemen DOM editor
@ViewChild('deleteModal') deleteModal: any;
@ViewChild('createModal') createModal: any;
@ViewChild('photoModal') photoModal: any;

private apiPath = 'portfolios';
data: any = {};
permission: any = {};

photoDialog: any = {
    modal: null,
    data: {},
    show: (data: any) => {
        this.photoDialog.data = data.photo;
        this.photoDialog.modal = this.modalService.open(this.photoModal, { keyboard: false, backdrop: 'static', centered: true });
    }
}


removePhoto(i: number): void {
    this.createDialog.images.splice(i, 1);
}

editorModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['blockquote', 'code-block'],
        [{ 'list': 'bullet' }],
        ['clean'],
    ]
  };

  browsePhoto(): void {
    const fileInput = document.getElementById('uploadImage') as HTMLInputElement;
  fileInput.click();
}

deleteDialog: any = {
    ids: [],
    isDeleting: false,
    modal: null,
    show: (ids: Array<any>) => {
        this.deleteDialog.ids = ids;
        this.deleteDialog.modal = this.modalService.open(this.deleteModal, { keyboard: false, backdrop: 'static', centered: true });
    },
    submit: () => {
        this.deleteDialog.isDeleting = true;
        let urlParameters = Object.entries(this.pageQuery.query.getValue()).filter(k => { return k[1] != null }).map(e => e.join('=')).join('&');
        this.http.Delete(this.apiPath + '/delete?' + urlParameters, this.deleteDialog.ids).then((r: any) => {
            this.deleteDialog.isDeleting = false;
            if (r.success) {
                this.data = r?.response?.result || {};
                this.deleteDialog.modal.close();
            }
        })
    }
}

uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            this.createDialog.images.push({
                photo: reader.result,
                source: file
            });
        };
        reader.readAsDataURL(file);
    }
}

createDialog: any = {
    images: [],
    formGroup : new FormGroup({
        name: new FormControl(),
        section: new FormControl(),
        status: new FormControl(1),
        order: new FormControl(),
        description: new FormControl(),
    }),
    isDeleting: false,
    modal: null,
    show: () => {
        this.deleteDialog.modal = this.modalService.open(this.createModal, { keyboard: false, backdrop: 'static', centered: true,size:'lg' });
    },
    submit: (form: FormGroup) => {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        form.disable();
        let fdata = new FormData();
        this.createDialog.images.forEach((e:any) => {
            fdata.append('photos[]',e.source)
        })
        fdata.append('data', JSON.stringify(form.value));
        this.deleteDialog.isDeleting = true;
        this.http.Post(this.apiPath + '/create',fdata ).then((r: any) => {
            this.deleteDialog.isDeleting = false;
            if (r.success) {
                this.data = r?.response?.result || {};
                this.createDialog.images = [];
                this.createDialog.formGroup.reset({
                    name: '',
                    section: '',
                    status: 1,
                    description: ''
                });
                this.createDialog.modal.close();
            }
        })
    }
}

setStatus(item: any): void {
    const old_status = item.status;
    item.status = item.status ? 0 : 1;
    this.http.Post(this.apiPath + '/set-status', { id: item.id, status: item.status }).then((r: any) => {
        if (!r.success) {
            item.status = old_status;
            return;
        }
        this.toastr.success('Changes saved successfully');
    });
}

isMe(item: any): boolean {
    return item.email == this.auth.userData?.email;
}


getData(): void {
    const query: any = this.pageQuery.query.getValue() || {};
    query.limit = query?.limit || 10;
    query.page = query?.page || 1;
    this.http.Get(this.apiPath, query).then((r: any) => {
        if (r.success) {
            this.data = r?.response?.result || {};
            this.permission = r?.permission || {};
        }
    });
}

ngOnInit(): void {
    this.pageQuery.init(() => {
        this.getData();
    });
}

ngOnDestroy(): void {
    this.pageQuery.destroy();
}
}
