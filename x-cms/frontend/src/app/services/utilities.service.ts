import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})

export class UtilitiesService {
    static jsonShow(json: any): string {
        return JSON.stringify(json, undefined, 2);
    }
    static formatDate(date: Date, format: string): string {
        return moment(date).format(format);
    }
    static generateColor(str: string): string {
        if (!str) return `rgb(0,0,0)`;
        let hash = 0;
        if (str.length === 0) { return ''; }
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            rgb[i] = (hash >> (i * 8)) & 255;
        }
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    static getBWColor(strRGB: string): string {
        const rgb = strRGB.replace(/rgb|\(|\)/gm, '').split(',');
        const brightness = Math.round(((Number(rgb[0]) * 299) + (Number(rgb[1]) * 587) + Number(rgb[2]) * 114)) / 1000;
        return (brightness > 125) ? 'black' : 'white';
    }
}
