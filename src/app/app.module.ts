
import { CustomToast } from './custom-modal/custom-toast';
import { CustomLoading } from './custom-modal/custom-loading';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { AddAlertComponent } from './customComponent/add-alert/add-alert.component';
import { WeatherService } from './servicios/weather.service';
import { ViewCardComponent } from './customComponent/view-card/view-card.component';
import { TranslateModule, TranslateLoader,TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function setTranslateLoader(http: any) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');}
  import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ScrollHideDirective } from './directives/scroll-hide.directive'
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './servicios/network.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Sensors} from '@ionic-native/sensors/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';









@NgModule({
  declarations: [AppComponent, AddAlertComponent, ViewCardComponent, ScrollHideDirective,],
  entryComponents: [AddAlertComponent,ViewCardComponent,],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,FormsModule,CustomLoading,CustomToast,
    ReactiveFormsModule,HttpClientModule, TranslateModule.forRoot({  //Módulo de traducción
      loader: {
        provide: TranslateLoader, 
        useFactory: (setTranslateLoader), 
        deps: [HttpClient]
      }
    })],
  providers: [
    StatusBar,
    SplashScreen,
    WeatherService,
    NativeStorage,
    Network,
    NetworkService,
    Diagnostic,
    Sensors,
    AndroidPermissions,
    
    

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
