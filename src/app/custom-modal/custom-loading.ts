import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { CustomToast } from '../custom-modal/custom-toast';
import { environment } from 'src/environments/environment';
//import { TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomLoading { //Clase que crea nuestro loading personalizado
  myloading:any;
  timeout;

  constructor(private loadingController:LoadingController,private toast:CustomToast,
    //private translate:TranslateService
    ){
  }
  
  //metodo que muestra el loading
  async show(msg) {
    this.myloading = await this.loadingController.create({
    message:msg,
    spinner:"crescent",
    leaveAnimation:null
    });
    this.timeout=setTimeout(()=>{
      this.myloading.dismiss();
      //this.toast.show(this.translate.instant("errorloading"));
    },environment.timemaxloading);
    await this.myloading.present(); 
  }

  //metodo que oculta el loading
  hide(){
    if(this.myloading){
      clearTimeout(this.timeout);
      this.myloading.dismiss();
    }
  }
}