import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})
export class DatePickerParserService {

    constructor() { }

    toYMD(date: NgbDateStruct): string {
        const { year, month, day } = date;
        const _month = month < 10 ? '0' + month : month;
        const _day = day < 10 ? '0' + day : day;
        return year + '-' + _month + '-' + _day;
    }

    toObject(date: string): NgbDateStruct | null {
        if (!date) return null;
        const _date = new Date(date + ' 00:00:00');
        const object = {
            year: _date.getFullYear(),
            month: _date.getMonth() + 1,
            day: _date.getDate()
        }
        return object;
    }

    toDate(date: NgbDateStruct): Date {
        return new Date(this.toYMD(date));
    }
}
