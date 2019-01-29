import { TranslateService } from '@ngx-translate/core';
import { CustomToast } from './../../custom-modal/custom-toast';

import { CustomLoading } from './../../custom-modal/custom-loading';
import { CloudserviceService } from '../../servicios/cloudservice.service';
import { ModalController, NavParams } from'@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.scss']
})

export class AddAlertComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  ngOnInit(): void {
    
  }

  private alerta: FormGroup; 
  longitud: any;
  latitud: any;
  customActionSheetOptions: any = {
    header: 'Alerta',
    subHeader: 'Seleccione el tipo de alerta'
  };
 

  constructor(public modalcontroller: ModalController, 
    private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    public loading: CustomLoading, 
    public navparams:NavParams,
    public toast: CustomToast,
    private translate: TranslateService  ) {

    //recuperamos a traves de NavParams, la clave valor que tenemos en la marca
    this.longitud = this.navparams.get('longitude');
    this.latitud = this.navparams.get('latitude');
    console.log(this.latitud, this.longitud);

    this.alerta = this.formBuilder.group({
      alertType: ['', Validators.required],
      descripcion: [''],
    });

  }

  resize() {
    var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
      var scrollHeight = element.scrollHeight;
      element.style.height = scrollHeight + 'px';
      this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
}



  //método que quita el modal
  dismiss() {
    this.modalcontroller.dismiss();
  }

  /* Se ejecuta al submit el formulario. Crea un objeto proveniente del
  formulario  y llama a la función anadir del
  servicio. Gestiona la
  Promise para sincronizar la interfaz. */
  uploadForm() {
 
    let data = {
      descripcion: this.alerta.get("descripcion").value,
      alert: this.alerta.get("alertType").value,
      longitud: this.longitud,
      latitud: this.latitud,
      hora: new Date().valueOf()

    };

    if (data.alert == 'accidente'){
      

      /* Mostramos el cargando... */
      this.loading.show("");
    // Llamamos al metodo anadir pasandole  los datos 

    this.CloudS.anadirA(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
       this.loading.hide();
        /*Cerramos el modal*/
        this.dismiss();
      })
      .catch((error) => {
        console.error("Error insertando documento: ", error);
        /* Cerramos el cargando...*/
        this.loading.hide();
        this.toast.show(this.translate.instant("errorloading"));
       


      });

    }else{

    /* Mostramos el cargando... */
    this.loading.show("");
    // Llamamos al metodo anadir pasandole  los datos 
   
    this.CloudS.anadirM(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
        this.loading.hide();
        /*Cerramos el modal*/
        this.dismiss();
        
      })
      .catch((error) => {
        
        /* Cerramos el cargando...*/
        this.loading.hide();
        this.toast.show(this.translate.instant("errorloading"));
        
      });
    }
  }
  
}
