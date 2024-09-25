import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageQueryService } from 'src/app/services/page-query.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-menu-view',
    templateUrl: './menu-view.component.html',
    styleUrls: ['./menu-view.component.scss']
})
export class MenuViewComponent implements OnInit, OnDestroy {

    constructor(
        public pageQuery: PageQueryService,
        public loading: LoadingService,
        private http: HttpService,
        public nav: NavigationService,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) {
        this.loading.start();
    }

    @ViewChild('deleteModal') deleteModal: any;
    private apiPath = 'navigations';
    data: any = {};
    util = UtilitiesService;
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
                    this.nav.getNav();
                    this.data = r?.response?.result || {};
                    this.deleteDialog.modal.close();
                }
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

    getData(): void {
        const query: any = this.pageQuery.query.getValue() || {};
        query.limit = query?.limit || 10;
        query.page = query?.page || 1;
        this.http.Get(this.apiPath, query).then((r: any) => {
            if (r.success) {
                this.data = r?.response?.result || {};
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
