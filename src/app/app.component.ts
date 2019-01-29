
import { Component } from '@angular/core';
import { Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';




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
  ) {
    this.platform.ready().then(() => {
      //Language
      if(this.translate.getBrowserLang() == "es"){
        this.translate.setDefaultLang('es');
      this.translate.use('es');
      }else{
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }
      
     

     
      this.splashScreen.hide();
    });
    
    this.initializeApp();
   
  }

  initializeApp() {

   
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  


  }



  changeLang(e) {
    //console.log(e.detail.checked);
    if (e.detail.checked) {
     
      this.translate.use("en");
    } else {
  
      this.translate.use("es");
    }
  }

}
