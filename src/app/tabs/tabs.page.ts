
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  plataforma: Boolean = true;
    constructor(
      private platform: Platform
     ) {
       if(!this.platform.is('android')){
         this.plataforma = false;

       }


  }

}
