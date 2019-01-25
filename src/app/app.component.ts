
import { Component } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import {environment} from '../environments/environment';



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
    this.langmenu = (environment.defaultLanguage == "es" ? false : true);
    
    this.initializeApp();
   
  }

  initializeApp() {

    this.translate.addLangs(environment.currentLanguages);  //add all languages
      this.translate.setDefaultLang(environment.defaultLanguage); //use default language
      if (this.translate.getBrowserLang) {  //if browsers's language is avalaible is set up as default
        if (environment.currentLanguages.includes(this.translate.getBrowserLang())) {
          this.translate.use(this.translate.getBrowserLang());
   
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

}
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
