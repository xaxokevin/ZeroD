import { Router, } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NavegacionService } from 'src/app/servicios/navegacion.service';


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
  fecha: any;
  fechaF: any;
  ciudad: String;
  calle: String;

  constructor(public modalcontroller: ModalController,public navparams:
    NavParams, public router: Router, private openM: NavegacionService) { 

      //al iniciar esta clase recibimos los parametos del navparams que luego usaremos

      this.descripcion=this.navparams.get('descripcion');
      this.alert=this.navparams.get('tipo');
      this.calle=this.navparams.get('calle');
      this.ciudad=this.navparams.get('ciudad');
      this.latitud=this.navparams.get('latitud');
      this.longitud=this.navparams.get('longitud');
      //Formateo de la fecha
      this.hora= new Date(this.navparams.get('hora'));
      this.horaS= this.hora.toString();
      this.fecha=this.horaS.split(" ",5)
      this.fechaF=this.fecha[0]+" "+this.fecha[1]+" "+this.fecha[2]+" "+this.fecha[3]+" "+this.fecha[4]

    }

  ngOnInit() {
  }

  /**
   * metodo que nos redirige hacia el mapa con la ubicacion de esa alerta
   */
  openMap(){
    console.log(this.longitud +"hola")
    this.openM.recibeUbicacion(this.latitud,this.longitud);
    this.openM.cargaMapa(true);
    this.router.navigate(['/tabs/tab2']);
    this.modalcontroller.dismiss();


  }

  /**
   * oculta el modal
   */
  cancel(){

    this.modalcontroller.dismiss();

  }

}
