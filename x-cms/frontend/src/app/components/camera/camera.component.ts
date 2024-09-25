import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  constructor(private toastr: ToastrService) { }
  @Output() onCapture = new EventEmitter();
  @Output() onError = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  error: string | null = null;
  trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void {
      this.trigger.next();
  }

  handleInitError(error: WebcamInitError): void {
      this.error = error.message;
      this.toastr.error(error.message, 'Camera Error');
      this.onError.emit(error);
  }

  handleImage(webcamImage: WebcamImage): void {
      const imageBlob = this.dataURItoBlob(webcamImage.imageAsDataUrl);
      this.onCapture.emit({ view: webcamImage.imageAsDataUrl, file: imageBlob });
  }

  get triggerObservable(): Observable<void> {
      return this.trigger.asObservable();
  }

  cancel(): void {
      this.onCancel.emit(true);
  }

  dataURItoBlob(dataURI: string): Blob {
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });
      return blob;

  }

  ngOnInit(): void {
      this.error = null;
      const permissionName = "camera" as PermissionName;
      navigator.permissions.query({ name: permissionName })
          .then((permission) => {
              if (permission.state == 'denied') {
                  this.error = 'Permission denied';
              }
              console.log("camera state", permission.state);
          }).catch((error) => {
              this.error = error;
              console.log('Got error :', error);
          })
  }

}
