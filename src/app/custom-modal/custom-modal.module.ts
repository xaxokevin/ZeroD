import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomModalModule { //Clase que nos crea los modales personalizados
  public changes = false;

  constructor(public modalCtrl: ModalController,) { }
//Metodo que nos crea el modal de add alert
//recibe el componente add alert, la longitud y latitud y la propia clase donde se llama
  async show(component, latitude,longitude, callback): Promise <any> {
    
    const modal = await this.modalCtrl.create({
      cssClass: "my-modal",
      backdropDismiss: true,
      component: component,  //El componente que se inyecta en la ventana modal
      componentProps: {latitude,longitude} //Los parámetros que se le pasan a la ventana modal
    });
    
    modal.onDidDismiss().then((d) => {

        if (callback.onModalClose)
          callback.onModalClose()
    });
    
    
    return await modal.present();
  }

//Metodo que nos crea el modal de add alert
//recibe el componente add alert, la info de la alerta y la propia clase donde se llama
  async showInfo(component, descripcion, tipo, hora, latitud, longitud,  callback): Promise <any>{
   
    const modal = await this.modalCtrl.create({
      cssClass: "mas-info",
      backdropDismiss: true,
      component: component,  //El componente que se inyecta en la ventana modal
      componentProps: {descripcion,tipo,hora, longitud, latitud} //Los parámetros que se le pasan a la ventana modal
    });
    modal.onDidDismiss().then((d) => {
        if (callback.onModalClose)
          callback.onModalClose()
    });
    
    
    return await modal.present();



  }

  async showHelp(component, callback): Promise <any>{
   
    const modal = await this.modalCtrl.create({
      cssClass: "show-help",
      backdropDismiss: true,
      component: component,  //El componente que se inyecta en la ventana modal
    });
    modal.onDidDismiss().then((d) => {
        if (callback.onModalClose)
          callback.onModalClose()
    });
    
    
    return await modal.present();



  }
  
}