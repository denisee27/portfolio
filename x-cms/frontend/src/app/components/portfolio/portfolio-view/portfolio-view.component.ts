import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PageQueryService } from 'src/app/services/page-query.service';
import { environment } from 'src/environments/environment';

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
@ViewChild('detailModal') detailModal: any;
@ViewChild('createModal') createModal: any;
@ViewChild('editModal') editModal: any;
@ViewChild('photoModal') photoModal: any;

private apiPath = 'portfolios';
data: any = {};
permission: any = {};
assetUrl = environment.assetUrl
photoDialog: any = {
    modal: null,
    data: {},
    show: (data: any,url:boolean = false) => {
        this.photoDialog.data = url == false ? data.photo : this.assetUrl + data.photo;
        this.photoDialog.modal = this.modalService.open(this.photoModal, { keyboard: false, backdrop: 'static', centered: true });
    }
}


removePhoto(i: number,item:any): void {
    console.log(item)
    if(!item.source){
        this.createDialog.deleteImage.push(item)
    }
    this.createDialog.images.splice(i, 1);
}

editorModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['blockquote', 'code-block'],
        [{ 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
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
                this.toastr.success('Data Deleted successfully', 'Success');
                this.deleteDialog.modal.close();
            }
        })
    }
}

detailDialog: any = {
    isDeleting: false,
    modal: null,
    data:{},
    show: (item:any) => {
        this.detailDialog.data = item;
        this.detailDialog.modal = this.modalService.open(this.detailModal, { keyboard: false, backdrop: 'static', centered: true,size:'lg' });
    },
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
    deleteImage:[],
    url:'',
    id:'',
    formGroup : new FormGroup({
        name: new FormControl(),
        section: new FormControl(),
        status: new FormControl(1),
        order: new FormControl(),
        frontend: new FormControl(),
        backend: new FormControl(),
        category: new FormControl(),
        description: new FormControl(),
    }),
    isDeleting: false,
    modal: null,
    show: (item:any,url:any) => {
        this.createDialog.url = url
        if(item){
            this.createDialog.id = item.id;
            item.images.forEach((e:any) => {
                this.createDialog.images.push({
                    id:e.id,
                    photo:this.assetUrl + e.photo
                })
            })
            this.createDialog.formGroup.patchValue({
                name: item.name,
                section: item.section,
                status: item.status,
                order: item.order,
                category: item.category,
                frontend: item.frontend,
                backend: item.backend,
                description: item.description
            });
        }
        this.createDialog.modal = this.modalService.open(this.createModal, { keyboard: false, backdrop: 'static', centered: true,size:'lg' });
    },
    submit: (form: FormGroup) => {
        if (!form.valid) {
            this.el.nativeElement.querySelectorAll('[formcontrolname].ng-invalid')?.[0]?.focus();
            return;
        }
        let fdata = new FormData();
        let uploadImg = this.createDialog.images.filter((e:any) => {
            return e.source != null
        })
        if(uploadImg.length > 0){
            uploadImg.forEach((e:any) => {
                fdata.append('photos[]',e.source)
            })
        }
        form.value.deleteImage = this.createDialog.deleteImage;
        form.value.id = this.createDialog.id
        fdata.append('data', JSON.stringify(form.value));
        this.createDialog.isDeleting = true;
        let urlParameters = Object.entries(this.pageQuery.query.getValue()).filter(k => { return k[1] != null }).map(e => e.join('=')).join('&');
        this.http.Post(this.apiPath + this.createDialog.url+ '?'+ urlParameters,fdata ).then((r: any) => {
            this.createDialog.isDeleting = false;
            if (r.success) {
                this.toastr.success('Data saved successfully', 'Success');
                this.createDialog.modal.close();
                this.data = r?.response?.result || {};
                this.createDialog.images = [];
                this.createDialog.deleteImage = [];
                this.createDialog.id ='';
                this.createDialog.formGroup.reset({
                    name: null,
                    section: null,
                    category: null,
                    backend: null,
                    frontend: null,
                    status: 1,
                    description: null
                });
            }
        })
    },
    close:()=>{
        this.createDialog.modal.close();
        this.createDialog.images = [];
        this.createDialog.deleteImage = [];
        this.createDialog.id ='';
        this.createDialog.formGroup.reset({
            name: null,
            section: null,
            category: null,
            backend: null,
            frontend: null,
            status: 1,
            description: null
        });
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
