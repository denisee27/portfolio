import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GeoJSONService {
    constructor(private http: HttpClient) { }
    private URL = 'https://nominatim.openstreetmap.org/search.php';
    private PARAMS = new HttpParams({
        fromObject: {
            format: 'json'
        },
    });
    search(term: string): Observable<any> {
        if (term === '') {
            return of([]);
        }
        return this.http
            .get<[any, string[]]>(this.URL, { params: this.PARAMS.set('q', term) })
            .pipe(map((response) => response));
    }
}
