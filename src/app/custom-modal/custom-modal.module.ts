import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { BackbuttonService } from 'src/app/servicios/backbutton.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomModalModule {
  public changes = false;

  constructor(public modalCtrl: ModalController, private back: BackbuttonService) { }

  async show(component, latitude,longitude, callback): Promise <any> {
    this.back.openModal = true;
    const modal = await this.modalCtrl.create({
      cssClass: "my-modal",
      backdropDismiss: true,
      component: component,  //El componente que se inyecta en la ventana modal
      componentProps: {latitude,longitude} //Los parámetros que se le pasan a la ventana modal
    });
    
    modal.onDidDismiss().then((d) => {
      //returns true so callback 
      this.back.openModal = false;
        if (callback.onModalClose)
          callback.onModalClose()
    });
    
    
    return await modal.present();
  }
  
}