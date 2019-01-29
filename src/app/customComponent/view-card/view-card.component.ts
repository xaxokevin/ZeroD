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
  longitudS: any;
  longitudSp: any;
  longitudF: any;
  latitud: any;
  latitudS: any;
  latitudSp: any;
  latitudF: any;
  hora: any;
  alert: any;
  horaS: string;
  fecha: any;
  fechaF: any;


  constructor(public modalcontroller: ModalController,public navparams:
    NavParams, public router: Router, private openM: NavegacionService) { 

      //al iniciar esta clase recibimos los parametos del navparams que luego usaremos

      this.descripcion=this.navparams.get('descripcion');
      this.alert=this.navparams.get('tipo');
      //Formateo de la longitud
      this.longitud=this.navparams.get('longitud');
      this.longitudS=this.longitud.toString();
      this.longitudSp=this.longitudS.split("",7)
      this.longitudF=this.longitudS[0]+this.longitudS[1]+this.longitudS[2]+this.longitudS[3]+this.longitudS[4]+this.longitudS[5]+this.longitudS[6]+this.longitudS[7];
      //Formateo de la latitud
      this.latitud=this.navparams.get('latitud');
      this.latitudS=this.latitud.toString();
      this.latitudSp=this.latitudS.split("",7)
      this.latitudF=this.latitudS[0]+this.latitudS[1]+this.latitudS[2]+this.latitudS[3]+this.latitudS[4]+this.latitudS[5]+this.latitudS[6];
      
      //Formateo de la fecha
      this.hora= new Date(this.navparams.get('hora'));
      this.horaS= this.hora.toString();
      this.fecha=this.horaS.split(" ",5)
      this.fechaF=this.fecha[0]+" "+this.fecha[1]+" "+this.fecha[2]+" "+this.fecha[3]+" "+this.fecha[4]
      

      
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

  cancel(){

    this.modalcontroller.dismiss();

  }

}
