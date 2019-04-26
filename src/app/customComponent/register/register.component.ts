import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomLoading } from 'src/app/custom-modal/custom-loading';
import { CustomToast } from 'src/app/custom-modal/custom-toast';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService } from 'src/app/servicios/network.service';
import { CloudserviceService } from 'src/app/servicios/cloudservice.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  image;
  imageV;
  default = true;
  public register: FormGroup;

  constructor(public modalcontroller: ModalController,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private netwoekS: NetworkService,
    private translate: TranslateService,
    public toast: CustomToast,
    public loading: CustomLoading,
    private CloudS: CloudserviceService,
    public router: Router,
    ) {

      this.register = this.formBuilder.group({
        user: ['', Validators.required],
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],
        pass: ['', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])],
        pass2: ['', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])],
      });
    }

  ngOnInit() {
  }

  registerForm() {
    if (this.netwoekS.previousStatus === 1) {
      this.toast.show(this.translate.instant('noNetwork'));
    } else if (this.netwoekS.previousStatus === 0) {


      const data = {
        user: this.register.get('user').value,
        email: this.register.get('email').value,
        pass: this.register.get('pass').value,
        pass2: this.register.get('pass2').value,
      };

      if (data.pass !== data.pass2) {

        this.toast.show(this.translate.instant('failPass'));
      } else {

      this.CloudS.createUser(this.image, data.user, data.email, data.pass);
      this.router.navigate(['/tabs/tab1']);
      this.cancel();

      }
  }

}

  newPic() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,  /*FILE_URI */
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
      correctOrientation: true,
      /* allowEdit:true,*/
      saveToPhotoAlbum: true,
      /*sourceType:0 es library, 1 camera, 2 saved */
      /* targetHeight:200,*/
      targetWidth: 200
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.image = 'data:image/jpeg;base64, ' + imageData;
      this.imageV = this.sanitizer.bypassSecurityTrustUrl(this.image);
      this.default = false;
    }, (err) => {
      // Handle error
    });
  }

  /**
   * método que quita el modal
   */
  cancel() {
    this.modalcontroller.dismiss();
  }


}
