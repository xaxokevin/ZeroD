import { Injectable } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BackbuttonService {
 
  currentURL: any = "";
  back: any;
  pressback: boolean =false;
  openModal = false;
 
  /*Este servicio controla el comportamiento del botón atrás en la aplicación */
  constructor(private platform: Platform,private router: Router, private navCtrl: NavController,){


    this.platform.backButton.subscribe(() => {
      // code that is executed when the user pressed the back button
      if(!this.openModal){
        if (this.currentURL == "/" || this.currentURL == "/tabs/tab1"){

          /*En caso de estar en la pestaña tab1 si se pulsa atrás se cierra la aplicación*/
          navigator['app'].exitApp();
        }else{

          this.pressback=true;
          this.navCtrl.back();
        }
    }
    });


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { 
         //es lanzado cuando se termina de navegar
        this.currentURL = event.url;

        }
    });

  }

  }


  
   
   
