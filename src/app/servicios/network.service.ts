import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, Events } from '@ionic/angular';
import { Observable } from 'rxjs';


/*
Enumeracion con dos valores
online para cuando la conexion a internet esta activa
offline para cuando la conexion a internet esta desactivada
*/
export enum ConnectionStatusEnum {
    Online,
    Offline
}



/*Proveedor de conexion a internet
con esta clase vamos a comprobar si tenemos internet o no
al iniciar la app o al realizar conexiones con firebase 
*/
@Injectable()
export class NetworkService {

  public previousStatus;
  public colorN;



  constructor(public alertCtrl: AlertController, 
              public network: Network,
              public eventCtrl: Events,
              public diagnostic: Diagnostic) {

    this.previousStatus = ConnectionStatusEnum.Online;
    
  }

  /*
  Metodo que nos va a comprobar la conexion a internet
  Cambia el valor de la enumeracion en funcion se active o se 
  desactive el internet
  */
    public initializeNetworkEvents(): void {
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }

    /**
 * 
 * Metodo que comprueba el gps y el estado que tiene
 */
    publicShowGPSEvent(): void{
        this.diagnostic.getLocationMode().then(locationMode =>{

            switch(locationMode){
                case this.diagnostic.locationMode.HIGH_ACCURACY:
                    this.eventCtrl.publish('High accuracy');
                    
                    break;
                case this.diagnostic.locationMode.BATTERY_SAVING:
                    
                    this.eventCtrl.publish('Battery saving');
                    break;
                case this.diagnostic.locationMode.DEVICE_ONLY:
                    
                    this.eventCtrl.publish('Device only');
                    break;
                case this.diagnostic.locationMode.LOCATION_OFF:
                    
                    this.eventCtrl.publish('Location off');
                    break;
            }

        })
            
        }

/**
 * 
 * Metodo que cambia el color del icono de la señal del gps
 */
        colorSignalGPS(color? ) {

           if(color == 'green'){
               console.log("hola soy el color "+color);
            this.colorN='success';

            }else if( color == 'yellow'){
                console.log("hola soy el color "+color);
                this.colorN='warning';
                
            }else if(color == 'orange'){
                console.log("hola soy el color "+color);
                this.colorN='danger';
               
            }else if(color == 'red'){
                console.log("hola soy el color "+color);
                this.colorN='dark';
               
            }
            
    

        }

}
