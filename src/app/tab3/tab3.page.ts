import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CustomLoading } from '../custom-modal/custom-loading';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CloudserviceService } from '../servicios/cloudservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemingService } from '../servicios/theming.service';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  valueKM: number;
  nigth: boolean;
  autoNight:boolean;
  usuario: boolean;
  imgV: any;
  perfil: any;
  activeAlert;
  toggle:boolean;

  constructor(
    private loading: CustomLoading,
    private router: Router,
    private nativeStorage: NativeStorage,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private cloudS: CloudserviceService,
    private themeS: ThemingService

  ) {

  }
/**
 * Iniciamos variables del usuario si existe
 */
  ionViewWillEnter() {
    //si el usuario esta creado
    this.nativeStorage.getItem('user').then(user => {

        this.usuario = true;

        this.perfil = user;

        this.imgV = this.sanitizer.bypassSecurityTrustUrl(user.img);

        this.cloudS.getNumberOfAlert(this.perfil.email).then(n => {

          this.activeAlert = n ;

        });

        this.nativeStorage.getItem('distance').then(distance => {

          this.valueKM = distance.km;
          }).catch(e => {

          this.valueKM = 1000;

          });

        this.nativeStorage.getItem('night').then(n => {

            this.nigth = n.night;
            }).catch(e => {

          this.nigth = false;

            });

        this.nativeStorage.getItem('autoNight').then(au => {

              this.autoNight = au.autoNight;
              }).catch(e => {

              this.autoNight = false;

              });

        this.nativeStorage.getItem('toggle').then(d => {

                this.toggle = d.toggle;
                }).catch(e => {

                this.toggle = false;

                });
    // si el usuario no existe
    }).catch(error => {

      this.usuario = false;

    });
  }

  /**
   * Metodo que navega hasta la pagina de registro/login de la aplicacion
   */
  loginRegister() {
    this.router.navigate(['register-login']);
  }


  /**
   * Establece el rango en Km de la distancia max que
   * nos cargara en las listas las alertas
   * @param valueKM Number
   */
  setValueKM(valueKM){

    this.nativeStorage.setItem('distance', {km: valueKM}).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

  }

  /**
   * Metodo que controla el modo noche manual
   * Si es verdadero se cambia a modo noche
   * Si es falso se cambia a modo dia
   * @param night Boolean
   */
  manualMode(night) {
    if (night === true) {
      this.nativeStorage.setItem('night', {night: night}).then(d => {
        this.themeS.setTheme('dark');
      }
      ).catch(e => {
        console.log(e);
      });
    } else if (night === false ) {
      this.nativeStorage.setItem('night', {night: night}).then(d => {
        this.themeS.setTheme('light');
      }
      ).catch(e => {
        console.log(e);
      });

    }


  }

  /**
   * Metodo que controla el modo atomatico del modo noche
   * Tambien bloquea el boton de modo manual si este esta activado
   * @param autoNight Boolean
   */
  autoMode(autoNight) {
    // almacenamos el valor que recibimos del toggle en la bd
    this.nativeStorage.setItem('autoNight', {autoNight: autoNight}).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

    // si es falso
    // guardamos el valor del toggle en falso en la bd
    // establecemos su valor
    // comprobamos el valor del modo manual para establecer el tema
    if(autoNight === false) {
      this.toggle = false;
      this.nativeStorage.setItem('toggle', {toggle: false}).then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      this.nativeStorage.getItem('night').then(r => {

        if (r.night === true) {

          this.themeS.setTheme('dark');
        } else if (r.night === false ) {
          this.themeS.setTheme('light');

        }


      });
    } else{
      // si es verdadero
      // almacenamos el valor en la bd del valor true del toggle
      this.nativeStorage.setItem('toggle', {toggle: false}).then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      // lo establecemos a true;
      this.toggle = true;

    }
  }


  /**
   * Cierra sesion en la aplicación
   */
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
