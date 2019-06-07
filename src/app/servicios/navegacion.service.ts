import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase utilizada para la navegacion del modal hacia la marca en el mapa
 */
export class NavegacionService { 
 private cargaM: boolean
 private latitud: any;
 private longitud: any;
 private addM: boolean;
  constructor() {

  this.cargaM=false;

   }

/**
 * recoge la ubicacion del modal
 * @param lat latitud de la ubicación del modal 
 * @param lng longitud de la ubicación del modal
 */
recibeUbicacion(lat:any, lng:any){
  console.log(lat +" "+ lng)

  this.latitud= lat;
  this.longitud=lng;
}
/**
 * Devuelve la latitud
 * @return this.latitud
 */
getLatitud(){

  return this.latitud;
}

/**
 * Devuelve la longitud
 * @returns this.longitud
 */
getLongitud(){

  return this.longitud;
}

/**
 *  Devuelve cargar mapa
 * @returns this.cargaM
 **/
getCargarMapa(){

  return this.cargaM;
}

/**
 * Establece el valor de cargar mapa a false
 */
setCargaMapa(){

  this.cargaM=false;
}

/**
 * Devuelve añadir mapa
 * @returns this.addM
 */
getAddM(){
  return this.addM;
}

/*
Establece el valor de añadir mapa a false
*/
setAddM(){
  this.addM=false;
}


/**
 * recibe true en el caso de que se haya la navegacion hacia el mapa desde el modal, por defecto esta a falso
 * @param verdad recibe true
   */
cargaMapa(verdad?: boolean){

this.cargaM=verdad;
 
}

/**
 * recibe true en el caso de que se haya la navegacion hacia el mapa desde el boton add, por defecto esta a falso
 * @param verdad recibe true
 */
addTab1Mark(verdad?: boolean){
  this.addM=verdad;
}


}
