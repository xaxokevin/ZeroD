import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingController } from '@ionic/angular';

import { environment } from 'src/environments/environment';




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
/**
 * Clase que crea nuestro loading personalizado
 */
export class CustomLoading {
  myloading:any;
  timeout;

  constructor(private loadingController:LoadingController){
  }
  
  /**
   * metodo que muestra el loading
   * @param msg mensaje a mostrar
   */
  async show(msg) {
    this.myloading = await this.loadingController.create({
    message:msg,
    spinner: null,
    leaveAnimation:null
    });
    this.timeout=setTimeout(()=>{
      this.myloading.dismiss();
    },environment.timemaxloading);
    await this.myloading.present(); 
  }

  /**
   * metodo que oculta el loading
   */
  hide(){
    if(this.myloading){
      clearTimeout(this.timeout);
      this.myloading.dismiss();
    }
  }
}