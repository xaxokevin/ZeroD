import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
/**
 * Clase que nos crea los modales personalizados
 */
export class CustomModalModule {
  public changes = false;

  constructor(public modalCtrl: ModalController,) { }
/**
 * Metodo que nos crea el modal de add alert
 * recibe el componente add alert, la longitud y latitud y la propia clase donde se llama
 * @param component recibel el modal
 * @param latitude latitud de la ubicacion
 * @param longitude longitud de la ubicacion
 * @param callback accion que ejecuta al cerrar el modal
 */
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

/**
 * Metodo que nos crea el modal de add alert 
 * recibe el componente add alert, la info de la alerta y la propia clase donde se llama
 * @param component componente a mostrar viewalert
 * @param descripcion descripcion del aviso
 * @param tipo tipo de aviso
 * @param hora fecha del aviso
 * @param latitud latitud de la ubicacion del aviso
 * @param longitud longitud de la ubicacion del aviso
 * @param callback lo que hace la cerrse el modal (this)
 */
  async showInfo(component, descripcion, tipo, hora, ciudad, calle, latitud,longitud ,callback): Promise <any>{
   
    const modal = await this.modalCtrl.create({
      cssClass: "mas-info",
      backdropDismiss: true,
      component: component,  //El componente que se inyecta en la ventana modal
      componentProps: {descripcion,tipo,hora, ciudad, calle,latitud, longitud} //Los parámetros que se le pasan a la ventana modal
    });
    modal.onDidDismiss().then((d) => {
        if (callback.onModalClose)
          callback.onModalClose()
    });
    
    
    return await modal.present();



  }

  /**
   * muestra el modal de ayuda
   * @param component recibe el componente de la ayuda
   * @param callback this
   */
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

  /**
   * muestra el modal de registro
   * @param component recibe el componente del home
   * @param callback this
   */
  async showRegister(component, callback): Promise <any>{
   
    const modal = await this.modalCtrl.create({
      cssClass: "show-register",
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