import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    constructor(
        public sidenav: SidenavService,
        public navService: NavigationService,
        public location: Location,
        private router: Router,
        private el: ElementRef
    ) { }

    currentPath: string = '';
    isCollapsed: boolean[] = [];
    navData: any[] = [];

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        if (window.innerWidth <= 991) {
            this.sidenav.close();
        } else {
            this.sidenav.open();
        }
    }

    isActive(path: string): boolean {
        const cPath = this.currentPath.split('/');
        const qPath = cPath[0]?.split('?');
        return path == qPath[0];
    }

    toggleNav(i: number): void {
        this.isCollapsed.forEach((_, e) => {
            if (e == i) {
                this.isCollapsed[e] = !this.isCollapsed[e];
            } else {
                this.isCollapsed[e] = false;
            }
        })
    }

    expandNav(): void {
        const el = this.el.nativeElement.querySelectorAll('.sub-nav.active');
        if (!el.length) {
            return;
        }
        const idx = el[0].parentNode.getAttribute('data-index') ?? -1;
        if (idx > -1) {
            this.toggleNav(idx);
        }
    }

    ngOnInit(): void {
        this.navService.navData.subscribe(e => {
            (e).forEach((i: any) => {
                if (i.childs.length) {
                    this.isCollapsed.push(false);
                }
            });
            this.navData = e;
            setTimeout(() => {
                this.expandNav();
            }, 500);
        });
        this.navService.getNav();
        this.router.events.pipe(filter(event => event instanceof NavigationEnd),
            distinctUntilChanged()
        ).subscribe((event: any) => {
            let url: string = event?.url;
            url = url.substring(1) || 'dashboard';
            this.currentPath = url;
        });
    }
}
