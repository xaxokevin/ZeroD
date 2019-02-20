import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
 

  constructor(public modalcontroller: ModalController) { }

  ngOnInit() {

  }
/**
 * Cierra el modal
 */
 onModalClose(){
  this.modalcontroller.dismiss();
 }

}
