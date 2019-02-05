import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService { //Clase utilizada para la navegacion del modal hacia la marca en el mapa
 private cargaM: boolean
 private latitud: any;
 private longitud: any;
 private addM: boolean;
  constructor() {

  this.cargaM=false;

   }

//recoge la ubicacion del modal
recibeUbicacion(lat:any, lng:any){

  this.latitud= lat;
  this.longitud=lng;
}
//Devuelve la latitud
getLatitud(){

  return this.latitud;
}
//Devuelve la longitud
getLongitud(){

  return this.longitud;
}

//Devuelve cargar mapa
getCargarMapa(){

  return this.cargaM;
}
//Establece el valor de cargar mapa a false
setCargaMapa(){

  this.cargaM=false;
}

//Devuelve añadir mapa
getAddM(){
  return this.addM;
}

//Establece el valor de añadir mapa a false
setAddM(){
  this.addM=false;
}


//recibe true en el caso de que se haya la navegacion hacia el mapa desde el modal, por defecto esta a falso
cargaMapa(verdad?: boolean){

this.cargaM=verdad;
 
}

//recibe true en el caso de que se haya la navegacion hacia el mapa desde el boton add, por defecto esta a falso
addTab1Mark(verdad?: boolean){
  this.addM=verdad;
}


}
