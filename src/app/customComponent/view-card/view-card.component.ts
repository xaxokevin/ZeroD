import { Router, } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NavegacionService } from 'src/app/servicios/navegacion.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent implements OnInit {

  descripcion: any;
  longitud: any;
  latitud: any;
  hora: any;
  alert: any;
  horaS: string;


  constructor(public modalcontroller: ModalController,public navparams:
    NavParams, public router: Router, private openM: NavegacionService) { 

      //al iniciar esta clase recibimos los parametos del navparams que luego usaremos

      this.descripcion=this.navparams.get('descripcion');
      this.longitud=this.navparams.get('longitud');
      this.latitud=this.navparams.get('latitud');
      this.hora= new Date(this.navparams.get('hora'));
      this.horaS= this.hora.toString();
      this.alert=this.navparams.get('tipo');

      
    }

  ngOnInit() {
  }

  //metodo que nos redirige hacia el mapa con la ubicacion de esa alerta
  openMap(){
    console.log("navegando");
    //Todo loading
    console.log(this.latitud,this.longitud);
    this.openM.recibeUbicacion(this.latitud,this.longitud);
    this.openM.cargaMapa(true);
    this.router.navigate(['/tabs/tab2']);
    this.modalcontroller.dismiss();


  }

}
