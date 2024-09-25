import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PageQueryService } from 'src/app/services/page-query.service';

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit, OnDestroy {
    constructor(
        public pageQuery: PageQueryService,
        public loading: LoadingService,
        private auth: AuthService,
        private http: HttpService,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) {
        this.loading.start();
    }

    @ViewChild('deleteModal') deleteModal: any;
    private apiPath = 'users';
    data: any = {};
    permission: any = {};

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
