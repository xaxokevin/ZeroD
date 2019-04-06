import { HelpComponent } from './../customComponent/help/help.component';
import { NetworkService } from './../servicios/network.service';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { iAccidente } from './../model/iAccident';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSlides, ModalController} from '@ionic/angular';
import { Router } from '@angular/router';
import { iMeteorology } from '../model/iMeteorology';
import { CustomLoading } from '../custom-modal/custom-loading';
import { WeatherService } from '../servicios/weather.service';
import { ViewCardComponent } from '../customComponent/view-card/view-card.component';
import { ScrollHideConfig } from '../directives/scroll-hide.directive';
import { NavegacionService } from '../servicios/navegacion.service';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';









@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  SwipedTabsIndicator: any = null;
  tabs = ["selectTab(0)", "selectTab(1)"];
  ntabs = 2;
  public category: any = "0";
  listadoAccidentes: iAccidente[] = [];
  listadoMeteorologia: iMeteorology[] = [];
  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
  listMvacia;
  listAvacia;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};

 
/**
 * 
 * @param cloudS objeto del servicion del almacenamiento
 * @param loading objeto de la clase loading, nos permite mostrar un cargando
 * @param aemet objeto del servicio que nos da la informacion del tiempo
 * @param cmm objeto de la calse custom modal, nos permite abrir el modal
 * @param netwoekS objeto que comprueba el funcionamiento de internet y gps
 * @param navegacion objeto del servicio que almacena variables temporales para la navegacion entre tab
 * @param router objeto que nos permite hacer navegacion hacia otra tab
 * @param modalController objeto del controlador del modal
 */
  constructor(
    private cloudS: CloudserviceService,
    private loading: CustomLoading,
    private aemet: WeatherService,
    private cmm: CustomModalModule,
    private netwoekS: NetworkService,
    private navegacion: NavegacionService,
    private router: Router,
    public modalController: ModalController,
    private nativeGeocoder: NativeGeocoder,
    private nativeStorage: NativeStorage
  
   
  ) {}

  /**
   * Metodo que comprueba la posicion del slider y la conexion a internet
   * cada vez que entra a la tab1
   */
  ionViewWillEnter() {
    //Comprobamos la posicion del slider
    this.SwipedTabsIndicator = document.getElementById("indicator");
    this.SwipedTabsSlider.length().then(l => {  
      this.ntabs = l;
    });
    //Comprobamos la conexion a internet
    if(this.netwoekS.previousStatus == 1){
      console.log("sin conexion")
    }else if(this.netwoekS.previousStatus == 0){
      this.updateAllAccident(); 
      this.updateAllMeteorology();
      //obtiene los datos del weather service (Falta implementacion)
      this.aemet.getRemoteData();
      this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, this.options)
    .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
    .catch((error: any) => console.log(error));
  
  this.nativeGeocoder.forwardGeocode('Berlin', this.options)
    .then((coordinates: NativeGeocoderForwardResult[]) => console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude))
    .catch((error: any) => console.log(error));
    }
  
  }
  

  /**
   * Se encarga de comprobar si las listas estan vacias
   * cuando es asi muestra la imagen de que todo esta ok
   */
  checkListA(){
    if(this.listadoAccidentes.length == 0){
      console.log("vacia")
      this.listAvacia= true;
    }else{
      console.log("llena")
      this.listAvacia=false;
    }
  }

/**
   * Se encarga de comprobar si las listas estan vacias
   * cuando es asi muestra la imagen de que todo esta ok
   */
  checkListM(){
    if(this.listadoMeteorologia.length == 0){
      this.listMvacia= true;
    }else{
      this.listMvacia=false;
    }
  }


  /**
   * 
   * Metodo de carga de los accidentes, se activa cuando se entra en la tab1
   * Muestra un loading que se quita cuando la carga desde firebase esta completa
   * @param event evento que desencadena el metodo
   */
  updateAllAccident(event?) {
  this.loading.show("");
    //Cargamos de la bd
      this.cloudS.getAccident(true).then(d => {
        
        this.listadoAccidentes = d;

        this.checkListA();


        
        if (event) {
          event.target.complete();
        }
      });

      this.loading.hide();  
      
    
  }

/**
 * Se activa cuando accionamos el refresher de la lista.
 * Carga los accidentes nuevos que se han añadido
 * @param event evento que desencadena el metodo
 * @param reload evento que activa la carga de la bd
 */
  updateAccident(event?, reload?) {
    if (!event)
      this.loading.show("");
    this.cloudS.getAccident(reload).then(d => {
      
      if (reload) {
        this.listadoAccidentes = d;
        this.checkListA();
      } else {
        d.forEach((u) => {
          this.listadoAccidentes.push(u);

        });
      }
      if (!event)
        this.loading.hide();
      if (event) {
        event.target.complete();
      }
      this.ionInfiniteScroll.disabled = !this.cloudS.isInfinityScrollEnabled();
    });
  }

   /**
   * 
   * Metodo de carga de la meteorologia, se activa cuando se entra en la tab1
   * Muestra un loading que se quita cuando la carga desde firebase esta completa
   * @param event evento que desencadena el metodo
   */
  updateAllMeteorology(event?) {
     
       this.cloudS.getMeteorology(true).then(d => {
         
         this.listadoMeteorologia = d;

         this.checkListM();
         
         if (event) {
           event.target.complete();
         }
       })
   
   }
 
  /**
 * Se activa cuando accionamos el refresher de la lista.
 * Carga la meteorologia nueva que se han añadido
 * @param event evento que desencadena el metodo
 * @param reload evento que activa la carga de la bd
 */
   updateMeteorology(event?, reload?) {
     if (!event)
       this.loading.show("");
     this.cloudS.getMeteorology(reload).then(d => {
       
       if (reload) {
         this.listadoMeteorologia = d;
         this.checkListM();
       } else {
         d.forEach((u) => {
           this.listadoMeteorologia.push(u);
         });
       }
       if (!event)
         this.loading.hide();
       if (event) {
         event.target.complete();
       }
       this.ionInfiniteScroll.disabled = !this.cloudS.isInfinityScrollEnabled();
     });
   }


  /* Actualiza la categoría que esté en ese momento activa*/
  updateCat(cat: Promise<any>) {
    cat.then(dat => {
      this.category = dat;
      this.category = +this.category; //to int;
      
    });
  }
  /* El método que permite actualizar el indicado cuando se cambia de slide*/
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) {  // this condition is to avoid passing to incorrect index
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });
  }
  /* El método que anima la "rayita" mientras nos estamos deslizando por el slide*/
  animateIndicator(e) {
    console.log(e.target.swiper.progress);
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
  }



  /**
   * Acciona el modal que muestra la informacion completa de la alerta
   * Recibe por parametros todos los campos de nuestra alerta
   * @param descripcion descripcion de la alerta
   * @param tipo tipo de alerta recibida
   * @param hora hora en la que se creo el evento
   * @param latitud latitud de la ubicación del evento
   * @param longitud longitud  de la ubicación del evento
   * Estas dos variables representan la ubicacion
   * 
   */
  
  showInfo(descripcion: any, tipo: any, hora: any, latitud: any, longitud:any){

    this.cmm.showInfo(ViewCardComponent, descripcion,tipo, hora, latitud, longitud,this)
  }
  /**
   * Metodo que inicia la navegacion hasta el mapa 
   * añadiendo una marca
   */
  anadeMarca(){
    this.navegacion.addTab1Mark(true);
    this.router.navigate(['/tabs/tab2']);
  }

  /**
   * Metodo que abre el modal de ayuda
   */
   presentModal() {
    this.cmm.showHelp(HelpComponent,this);
    
  }
}
