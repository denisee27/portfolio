import { Component, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
    constructor() { }
    @Input() userData: any = {};
    @Input() height: number = 32;
    @Input() width: number = 32;
    genStyle(): any {
        const bgCol = UtilitiesService.generateColor(this.userData.name);
        const txCol = UtilitiesService.getBWColor(bgCol);
        return { 'background-color': bgCol, 'color': txCol, 'height': this.height + 'px', 'width': this.width + 'px' };
    }
}
