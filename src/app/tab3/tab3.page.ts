import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CustomLoading } from '../custom-modal/custom-loading';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CloudserviceService } from '../servicios/cloudservice.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  valorkm: number;
  usuario: boolean;
  imgV: any;
  perfil: any;
  activeAlert;

  constructor(
    private loading: CustomLoading,
    private router: Router,
    private nativeStorage: NativeStorage,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private cloudS: CloudserviceService,

  ) {

    this.valorkm = 10;
  }

  ionViewWillEnter() {

    this.nativeStorage.getItem('user').then(user => {

      if (user == null) {

        this.usuario = false;
      } else {

        this.usuario = true;
        this.perfil = user;
        this.imgV = this.sanitizer.bypassSecurityTrustUrl(user.img);
        this.cloudS.getNumberOfAlert(this.perfil.email).then(n => {
          this.activeAlert = n ;
        });
      }

    }).catch(error =>{
      console.log(error);
    });
  }

  /**
   * Metodo que navega hasta la pagina de registro/login de la aplicacion
   */
  loginRegister() {
    this.router.navigate(['register-login']);
  }


  // falta almacenar el valor en la bd
  getValueKM(valueKM){

    console.log(valueKM);

  }

  logout() {

    this.nativeStorage.remove('user').then(user => {

      this.usuario = false;

    }).catch(error =>{
      console.log(error);
    });
    this.router.navigateByUrl('/tabs/tab3');
  }

  updatePic() {

    const options: CameraOptions = {
      quality: 100,
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
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64, ' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  getImagen(img) {
    if (img) {
      return;
    } else {
      return img;
    }
  }

}
