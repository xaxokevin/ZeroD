
import { Component, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { CustomLoading } from '../custom-modal/custom-loading';

import { NativeStorage } from '@ionic-native/native-storage/ngx';









@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  valorkm: number;
 usuario: boolean;

  constructor(
    private loading: CustomLoading,
    private router: Router,
    private nativeStorage: NativeStorage
  
   
  ) {

    this.valorkm=10;
  }

  ionViewWillEnter() {

    this.nativeStorage.getItem('user').then(user =>{

      if(user == null){

        this.usuario = false;
      }else{

        this.usuario = true;
      }

    }).catch(error =>{
      console.log(error);
    })
  }

  /**
   * Metodo que navega hasta la pagina de registro/login de la aplicacion
   */
  loginRegister(){
    this.router.navigate(["register-login"])
  }

  //falta almacenar el valor en la bd
  getValueKM(valueKM){

    console.log(valueKM);

  }

  logout(){

    this.nativeStorage.remove('user').then(user =>{

      this.usuario = false;

     console.log(user);

    }).catch(error =>{
      console.log(error);
    })
    this.router.navigateByUrl("/tabs/tab3")
  }

}
