import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, Events } from '@ionic/angular';

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

  constructor(public alertCtrl: AlertController, 
              public network: Network,
              public eventCtrl: Events) {

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

}