import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { AuthService } from '../services/auth.service';

@Pipe({
    name: 'dateFormat'
})
export class DatePipe implements PipeTransform {
    transform(date: Date | string, format?: string): string {
        if (!date) return '';
        moment.locale('en');
        return moment(date).utc().utcOffset('+07:00').format(format || 'DD MMM YYYY, HH:mm') + (!format ? ' WIB' : '');
    }
}

@Pipe({
    name: 'timeFormat'
})
export class TimePipe implements PipeTransform {
    transform(time: Date, format?: string): string {
        if (!time) return '';
        return moment('1970-01-01 ' + time).utc().utcOffset('+07:00').format(format || 'HH:mm');
    }
}

@Pipe({
    name: 'numberFormat'
})
export class NumberPipe implements PipeTransform {
    transform(number: any, showCurrency = false): string {
        if (number == null || number == undefined) return '';
        let seperator = '.';
        let decimal = ',';
        let sNumber = Number(number).toFixed(2).toString().replace(/\./g, ',').split(',');
        let fNumber = sNumber[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
        let theNumber = fNumber + ((sNumber.length > 1 && Math.abs(Number(sNumber[1])) > 0) ? decimal + sNumber[1] : '');
        return (showCurrency ? 'Rp' + ' ' : '') + theNumber;
    }
}

@Pipe({
    name: 'currencyName'
})
export class CurrencyNamePipe implements PipeTransform {
    transform(val: any): string {
        return val + ' (Rp)';
    }
}

@Pipe({
    name: 'haveKeys'
})
export class HaveKeysPipe implements PipeTransform {
    transform(val: any): boolean {
        let result: number = 0;
        Object.keys(val).forEach((key: any) => {
            if (val[key] != null) {
                result++;
            }
        });
        return result > 0;
    }
}

@Pipe({
    name: 'noSpace'
})
export class NoSpacePipe implements PipeTransform {
    transform(value: any): string {
        return (value || '').toString().replace(/\s/g, '');
    }
}

@Pipe({
    name: 'toSpace'
})
export class ToSpacePipe implements PipeTransform {
    transform(value: any, toReplace: string): string {
        return (value || '').toString().replace(new RegExp(toReplace, 'g'), ' ');
    }
}

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any[], keyFilter: string, valFilter: any, orKeyFilter?: string, orValFilter?: any): any[] {
        return value.filter((e: any) => {
            if (valFilter == '' || valFilter === null || valFilter === undefined) {
                return true;
            }
            if (orKeyFilter) {
                return e[keyFilter] == valFilter || e[orKeyFilter] == orValFilter;
            }
            return e[keyFilter] == valFilter;
        });
    }
}

@Pipe({
    name: 'me'
})
export class MePipe implements PipeTransform {
    constructor(private auth: AuthService) { }
    transform(value?: any): string {
        return this.auth.userData.name;
    }
}

@Pipe({
    name: 'now'
})
export class NowPipe implements PipeTransform {
    transform(value?: any): string {
        return moment((new Date())).utc().utcOffset('+07:00').format('DD MMM YYYY, HH:mm');
    }
}


