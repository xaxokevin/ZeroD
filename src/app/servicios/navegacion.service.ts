import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService { //Clase utilizada para la navegacion del modal hacia la marca en el mapa
 public cargaM: boolean

 public ltLng: any []=[];
  constructor() {

    this.cargaM=false;


   
   }

//recoge la ubicacion del modal
recibeUbicacion(lat:any, lng:any){

  this.ltLng.push(lat);
  this.ltLng.push(lng);

}


//recibe true en el caso de que se haya la navegacion hacia el mapa, por defecto esta a falso
cargaMapa(verdad?: boolean){

this.cargaM=verdad;
 
}


}
