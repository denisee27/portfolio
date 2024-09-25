import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UomService {

    constructor(private http: HttpClient) { }

    getUoMList(): Observable<string[]> {
        const rnd = Math.random();
        return this.http.get<string[]>('/assets/uom.json?' + rnd).pipe(map(e => e.sort()));
    }
}
