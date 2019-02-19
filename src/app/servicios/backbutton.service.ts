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
       console.log("Hemos pulsado atras");
      if(!this.openModal){
        console.log(">>>>"+this.currentURL);
        if (this.currentURL == "/" || this.currentURL == "/tabs/tab1"){

          /*En caso de estar en la pestaña tab1 si se pulsa atrás se cierra la aplicación*/
          navigator['app'].exitApp();
        }else{

          this.pressback=true;
        }
    }
      
    });
    


    this.router.events.subscribe((event) => {
      console.log(event);
      if (event instanceof NavigationEnd) { 
        console.log("Navegacion"+this.pressback);
         //es lanzado cuando se termina de navegar
        this.currentURL = event.url;
       
         if(this.pressback) {  //Este no debe ser alcanzado nunca, es por si acaso
            this.navCtrl.navigateRoot(['/'], { animationDirection: "back" });
            this.pressback = false; 
          }

        
        }
    });

  }
    

  }


  
   
   
