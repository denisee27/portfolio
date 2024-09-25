import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    private svgToImage(): any {
        const canvas: any = document.querySelectorAll(".qrcode canvas")?.[0];
        return canvas?.toDataURL('image/png');
    }

    print(): void {
        const src = this.svgToImage();
        const img = `<img src="${src}" class="img-fluid" style="height:100px;width:auto" />`;
        let qr_img = document.querySelectorAll('.qr-img')?.[0];
        if (qr_img) {
            qr_img.innerHTML = img;

        }
        let el: any = document.querySelectorAll('[printsectionid="printSection"]')?.[0];
        el.click();
    }
}
