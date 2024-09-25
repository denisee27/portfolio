import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AfterLoginGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['login'], { queryParams: { return: state.url } });
        }
        return this.auth.isLoggedIn();
    }
}

@Injectable({
    providedIn: 'root'
})
export class BeforeLoginGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router) {
    }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['dashboard']);
        }
        return !this.auth.isLoggedIn();
    }
}

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}
@Injectable({
    providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

}
