import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
	public status = false;
	start(): void {
	    setTimeout(() => {
	        this.status = true;
	    }, 1);
	}
	done(): void {
	    setTimeout(() => {
	        this.status = false;
	    }, 1);
	}
}
