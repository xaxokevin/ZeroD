import { BackbuttonService } from './servicios/backbutton.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemingService } from './servicios/theming.service';
import { NetworkService } from './servicios/network.service';
import { Component } from '@angular/core';
import { Platform, Events} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { CustomToast } from './custom-modal/custom-toast';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Sensors, TYPE_SENSOR} from '@ionic-native/sensors/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { CloudserviceService } from './servicios/cloudservice.service';
import { iUser } from './model/iUser';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  light: number;
  perfil: iUser[] = [];

  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    public events: Events,
    public network: Network,
    public networkS: NetworkService,
    public toast: CustomToast,
    public diagnostic: Diagnostic,
    public themeS: ThemingService,
    public sensor: Sensors,
    public bar: StatusBar,
    private nativeStorage: NativeStorage,
  ) {
    this.light = 0;
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {

      // Establecemos el color de inicio de la barra de estado
      this.bar.backgroundColorByHexString('#71A1F0');

      /*Comprobamos el idioma del dispositivo
      Si el dispositivo esta en español, la aplicacion se inicia en español
      Si el dispositivo esta en otro idioma, por defecto se inicia en ingles
      */


      if (this.translate.getBrowserLang() === 'es') {
        this.translate.setDefaultLang('es');
      this.translate.use('es');
      } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }

      // Comprobamos la conexion a internet
      this.networkS.initializeNetworkEvents();

      // Evento que se ejecuta cuando la conexion esta inactiva
      this.events.subscribe('network:offline', () => {
        this.toast.show(this.translate.instant('noNetwork'));
      });

      // Evento que se  ejecuta cuando la conexion esta activa
      this.events.subscribe('network:online', () => {
        this.toast.show(this.translate.instant('Network') + ': ' + this.network.type);
      });
    });

    /**
     * Comprobamos la calidad del  GPS
     * Falta mejora del servicio que
     * administra este evento
     *  */
    setInterval(() => { this.networkS.publicShowGPSEvent();
   }, 10000);

    this.events.subscribe('High accuracy', () => {
      this.networkS.colorSignalGPS('green');
    });
    this.events.subscribe('Battery saving', () => {
      this.networkS.colorSignalGPS('yellow');
    });
    this.events.subscribe('Device only', () => {
      this.networkS.colorSignalGPS('orange');
    });
    this.events.subscribe('Location off', () => {
      this.networkS.colorSignalGPS('red');
    });

    this.initSensor();

    this.splashScreen.hide();


  }

 
/**
 * Metodo encargado de inicializar el sensor
 * Si se ha activado la opción de modo noche automático
 * Se ejecuta cada 15 segundos comprobando la
 * Luz ambiental que recibee nuestro telefono
 * Y cambia el tema segun la intensida de luz
 */
initSensor() {

  setInterval(() => {

    this.nativeStorage.getItem('autoNight').then(e => {

      if (e.autoNight === true) {

      this.sensor.enableSensor(TYPE_SENSOR.LIGHT).then(d => {
        console.log(d);
      }).catch( e => {
        console.log(e);
      });
      this.sensor.getState().then(d => {
      this.light = d[0];
      this.themeS.changeSkin(this.light);
      });
    }
    }).catch(e => {
      this.themeS.changeSkin(11);
    });
  }, 13000);

}

}
