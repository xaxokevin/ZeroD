import { CloudserviceService } from '../../servicios/cloudservice.service';
import { ModalController, LoadingController, NavParams } from
  '@ionic/angular';
import { Component, OnInit } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.scss']
})
export class AddAlertComponent implements OnInit {

  private alerta: FormGroup; //Instancia del FormGroup de nueva.page.html
  myloading: any; //mejorable con un servicio destinado a estos menesteres...
  //Lo usamos para mostrar un cargando mientras se realiza la operación.
  longitud: any;
  latitud: any;
  temporal: any;
  //variables que vamos a recuperar del mapa para poder crear un aviso

  constructor(public modalcontroller: ModalController, private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    private router: Router,
    public loadingController: LoadingController, public navparams:
      NavParams) {

    //recuperamos a traves de NavParams, la clave valor que tenemos en la marca
    this.longitud = this.navparams.get('longitude');
    this.latitud = this.navparams.get('latitude');
    console.log(this.latitud, this.longitud);

    this.alerta = this.formBuilder.group({
      alertType: ['', Validators.required],
      descripcion: [''],
    });

  }



  ngOnInit() {
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
    console.log(this.alerta);
    let data = {
      descripcion: this.alerta.get("descripcion").value,
      alert: this.alerta.get("alertType").value,
      longitud: this.longitud,
      latitud: this.latitud

    };
    

    if (data.alert == 'accidente'){
      

      /* Mostramos el cargando... */
    this.myloading = this.presentLoading();
    // Llamamos al metodo anadir pasandole  los datos 
    console.log("dentro de accidente");
    this.CloudS.anadirA(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
        /*Cerramos el modal*/
        this.dismiss();
      })
      .catch((error) => {
        console.error("Error insertando documento: ", error);
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
        /* Mostramos un mensaje de error */
        /* A desarrollar, se aconseja emplear un componente denominado
        toast */
      });

    }else{

    /* Mostramos el cargando... */
    this.myloading = this.presentLoading();
    // Llamamos al metodo anadir pasandole  los datos 
    console.log("dentro de meteo");
    this.CloudS.anadirM(data)
      .then((docRef) => {
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
        /*Cerramos el modal*/
        this.dismiss();
      })
      .catch((error) => {
        console.error("Error insertando documento: ", error);
        /* Cerramos el cargando...*/
        this.loadingController.dismiss();
        /* Mostramos un mensaje de error */
        /* A desarrollar, se aconseja emplear un componente denominado
        toast */
      });
    }
  }
  
  /* Es un componente de la interfaz IONIC v4 */
  async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: 'Guardando'
    });
    return await this.myloading.present();
  }
}
