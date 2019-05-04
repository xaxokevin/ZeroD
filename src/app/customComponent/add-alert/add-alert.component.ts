import { NetworkService } from './../../servicios/network.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomToast } from './../../custom-modal/custom-toast';
import { CustomLoading } from './../../custom-modal/custom-loading';
import { CloudserviceService } from '../../servicios/cloudservice.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';



@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.scss']
})

export class AddAlertComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  public alerta: FormGroup;
  longitud: any;
  latitud: any;
  customActionSheetOptions: any = {
    header: this.translate.instant('Select'),
    subHeader: this.translate.instant('TypeS'),
  };
  usuario: String;
  ngOnInit(): void {
  }


  constructor(public modalcontroller: ModalController,
    private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    public loading: CustomLoading, 
    public navparams:NavParams,
    public toast: CustomToast,
    private translate: TranslateService,
    private netwoekS: NetworkService,
    private nativeStorage: NativeStorage, ) {

      // recuperamos el email del usuario
    this.nativeStorage.getItem('user').then(e => {

        this.usuario = e.email.toString();

        console.log(this.usuario);

      }).catch(error => {

        console.log(error);

      });

    // recuperamos a traves de NavParams, la clave valor que tenemos en la marca
    this.longitud = this.navparams.get('longitude');
    this.latitud = this.navparams.get('latitude');

    this.alerta = this.formBuilder.group({
      alertType: ['', Validators.required],
      descripcion: [''],
    });

  }

  /**
   * metodo que establece la refactorizacion del text area
   */
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
}



  /**
   * método que quita el modal
   */
  cancel() {
    this.modalcontroller.dismiss();
  }

  /* Se ejecuta al submit el formulario. Crea un objeto proveniente del
  formulario  y llama a la función anadir del
  servicio. 
  Antes de ejecutar el submit comprobamos si tenemos conexion a internet
  Si no tenemos salta un toast para que le demos internet
  Si tenemos internet nos permite hacer el submit */
  uploadForm() {
    if (this.netwoekS.previousStatus === 1) {
      this.toast.show(this.translate.instant('noNetwork'));
    } else if (this.netwoekS.previousStatus === 0) {

      let data = {
        descripcion: this.alerta.get('descripcion').value,
        alert: this.alerta.get('alertType').value,
        longitud: this.longitud,
        latitud: this.latitud,
        hora: new Date().valueOf(),
        user: this.usuario,
        icon: '',
      };
      switch (data.alert) {
        case 'accidente': {
           data.icon = 'car';
           this.addAccident(data);
           break;
        }
        case 'control' : {
          data.icon = 'hand';
          this.addAccident(data);
           break;
        }
        case 'radar'  : {
          data.icon = 'speedometer';
          this.addAccident(data);
          break;
        }
        case 'atasco' : {
          data.icon = 'hourglass';
          this.addAccident(data);
          break;
        }
        case 'obras' : {
          data.icon = 'hammer';
          this.addAccident(data);
         break;
        }
        case 'lluvia' : {
          data.icon = 'rainy';
          this.addMeteorology(data);
          break;
        }
        case 'nieve' : {
          data.icon = 'snow';
          this.addMeteorology(data);
          break;
        }
        case 'viento' : {

          data.icon = 'swap';
          this.addMeteorology(data);
          break;
        }
        case 'olas' : {

          data.icon = 'boat';
          this.addMeteorology(data);
          break;
        }
        case 'niebla' : {

          data.icon = 'cloudy';
          this.addMeteorology(data);
          break;
        }
        default: {
          this.toast.show(this.translate.instant('errorloading'));
           break;
        }
     }
    }
  }

  addAccident(data) {

    /* Mostramos el cargando... */
    this.loading.show('');
    // Llamamos al metodo anadir pasandole  los datos
    this.CloudS.anadirA(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
       this.loading.hide();
        /*Cerramos el modal*/
        this.cancel();
      })
      .catch((error) => {
        /* Cerramos el cargando...*/
        this.loading.hide();
        this.toast.show(this.translate.instant('errorloading'));

      });

  }

  addMeteorology(data){
    /* Mostramos el cargando... */
    this.loading.show('');
    // Llamamos al metodo anadir pasandole  los datos 
    this.CloudS.anadirM(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
        this.loading.hide();
        /*Cerramos el modal*/
        this.cancel();
      })
      .catch((error) => {
        /* Cerramos el cargando...*/
        this.loading.hide();
        this.toast.show(this.translate.instant('errorloading'));
      });
  }
}
