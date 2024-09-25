import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    private _status = new BehaviorSubject<boolean>(true);
    constructor() {
        if (window.innerWidth <= 991) {
            this._status.next(false);
        }
    }
    toggle(): void {
        if (!this._status.getValue()) {
            this._status.next(true);
        } else {
            this._status.next(false);
        }
    }

    open(): void {
        this._status.next(true);
    }

    close(): void {
        this._status.next(false);
    }

    unsubscribe(): void {
        this._status.unsubscribe();
    }

    subscribe(): void {
        this._status.subscribe();
    }

    get status(): BehaviorSubject<boolean> {
        return this._status;
    }
}
