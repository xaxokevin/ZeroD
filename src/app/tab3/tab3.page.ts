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
  night: boolean;
  autoNight:boolean;
  usuario: boolean = false;
  imgV: any;
  perfil: any;
  activeAlert;
  toggle:boolean;
  profileTema:boolean=false;

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
    // si el usuario esta creado
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

        this.nativeStorage.getItem('themeManual').then(n => {

          if (n.night === true) {

            this.themeS.changeSkin(9);
            this.night = true;
            this.profileTema= true;

          } else{

            this.themeS.changeSkin(11);
            this.night = false;
            this.profileTema= false;

          }
        }).catch(e => {

          console.log('Aun no hay usuario o no se ha cambiado de tema');
            });

        this.nativeStorage.getItem('themeAuto').then(au => {

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

      console.log('No hay usuario aun')

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
      this.nativeStorage.setItem('themeManual', {night: night}).then(d => {
        console.log('Tema establecido a dark en manual');
        this.themeS. changeSkin(9);
        this.night= true;
        this.profileTema= true;
      }
      ).catch(e => {
        console.log(e);
      });
    } else if (night === false ) {
      this.nativeStorage.setItem('themeManual', {night: night}).then(d => {
        console.log('Tema establecido a light en manual');
        this.themeS. changeSkin(11);
        this.night= false;
        this.profileTema= false;
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
    this.nativeStorage.setItem('themeAuto', {autoNight: autoNight}).then(
      () => console.log('Boton tema automático'),
      error => console.error('Error storing item', error)
    );
    // si es falso
    // guardamos el valor del toggle en falso en la bd
    // establecemos su valor
    // comprobamos el valor del modo manual para establecer el tema
    if (autoNight === false) {
      this.toggle = false;
      this.nativeStorage.setItem('toggle', {toggle: false}).then(
        () => console.log('No esta deshabilitado el modo manual'),
        error => console.error('Error storing item', error)
      );
      this.nativeStorage.getItem('themeManual').then(r => {

        if (r.night === true) {

          this.themeS.changeSkin('9');

        } else if (r.night === false ) {
          this.themeS.changeSkin('11');


        }
});
    } else {
      // si es verdadero
      // almacenamos el valor en la bd del valor true del toggle
      this.toggle = true;
      this.nativeStorage.setItem('toggle', {toggle: true}).then(
        () => console.log('Esta deshabilitado el modo manual'),
        error => console.error('Error storing item', error)
      );
    }
  }


  /**
   * Cierra sesion en la aplicación
   */
  logout() {

    this.nativeStorage.clear().then(e => {
      console.log(e);
      this.usuario = false;
      this.router.navigateByUrl('/tabs/tab3');

    }).catch(error =>{
      console.log(error);
    });
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
