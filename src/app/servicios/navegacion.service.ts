import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService { //Clase utilizada para la navegacion del modal hacia la marca en el mapa
 private cargaM: boolean
 private latitud: any;
 private longitud: any;
  constructor() {

  this.cargaM=false;

   }

//recoge la ubicacion del modal
recibeUbicacion(lat:any, lng:any){

  this.latitud= lat;
  this.longitud=lng;
}

getLatitud(){

  return this.latitud;
}
getLongitud(){

  return this.longitud;
}

getCargarMapa(){

  return this.cargaM;
}

setCargaMapa(){

  this.cargaM=false;
}


//recibe true en el caso de que se haya la navegacion hacia el mapa, por defecto esta a falso
cargaMapa(verdad?: boolean){

this.cargaM=verdad;
 
}


}
