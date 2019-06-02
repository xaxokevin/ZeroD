import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
/**
 * Clase que nos crea un toast personalizado
 */
export class CustomToast { 
  toast;
  constructor(private toastCtrl: ToastController) { }
/**
 * metodo que nos crea el toast en la parte inferior
 * @param msg mensaje a mostrar
 */
  async show(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      duration: 5000
    });
    toast.present();
  }

  /**
   * metodo que nos muestra el toast en la parte de arriba
   * @param msg mensaje a mostrar
   * @param time tiempo en el que se muestra
   */
  async showTop(msg, time?) {
    if (this.toast)
      this.toast.dismiss();
    if (!time) {
      this.toast = await this.toastCtrl.create({
        message: msg,
        showCloseButton: true,
        position: 'top',
        closeButtonText: 'Ok',
      });
      this.toast.present();
    } else {
      this.toast = await this.toastCtrl.create({
        message: msg,
        showCloseButton: false,
        position: 'top',
        closeButtonText: 'Ok',
        duration: time
      });
      this.toast.present();
    }
  }
}