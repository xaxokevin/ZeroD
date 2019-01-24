
import {  HttpClientModule} from '@angular/common/http';
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









@NgModule({
  declarations: [AppComponent, AddAlertComponent, ViewCardComponent,],
  entryComponents: [AddAlertComponent,ViewCardComponent,],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,FormsModule,CustomLoading,CustomToast,
    ReactiveFormsModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    WeatherService,
    

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
