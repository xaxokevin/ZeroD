import { NetworkService } from './servicios/network.service';
import { Component } from '@angular/core';
import { Platform, Events} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { CustomToast } from './custom-modal/custom-toast';





@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  langmenu: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    public events: Events,
    public network: Network,
    public networkS: NetworkService,
    public toast: CustomToast
  ) {
    
    
    this.initializeApp();
   
  }

  initializeApp() {

    this.platform.ready().then(() => {
      /*Comprobamos el idioma del dispositivo
      Si el dispositivo esta en español, la aplicacion se inicia en español
      Si el dispositivo esta en otro idioma, por defecto se inicia en ingles
      */

      if(this.translate.getBrowserLang() == "es"){
        this.translate.setDefaultLang('es');
      this.translate.use('es');
      }else{
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }

      //Comprobamos la conexion a internet
      this.networkS.initializeNetworkEvents();

      // Evento que se ejecuta cuando la conexion esta inactiva
      this.events.subscribe('network:offline', () => {
        this.toast.show(this.translate.instant("noNetwork"));
           
      });

      // Evento que se  ejecuta cuando la conexion esta activa
      this.events.subscribe('network:online', () => {
        this.toast.show(this.translate.instant("Network")+": "+this.network.type);      
      });
      
    
      
    });

   
  
    this.splashScreen.hide();

  }



}
