import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    constructor(
        public sidenav: SidenavService,
        private auth: AuthService,
        private router: Router,
        public notif: NotificationService,
        private modalService: NgbModal,
    ) { }

    @ViewChild('logoutModal') logoutModal: any;
    userData: any = {};
    lModal: any;
    loading = false;
    notifInterval: any = null;

    logout(): void {
        this.lModal = this.modalService.open(this.logoutModal, { backdrop: 'static', keyboard: false, centered: true });
    }

    goLogout(): void {
        clearInterval(this.notifInterval);
        this.loading = true;
        this.auth.logout().then(() => {
            this.lModal.close();
            this.loading = false;
        });
    }

    gotoUrl(item: any): void {
        this.notif.read(item.id);
        this.router.navigate([item.url]);
    }

    ngOnInit(): void {
        this.userData = this.auth.userData;
        // this.notif.getCount();
    }

    ngOnDestroy(): void {
    }

}
