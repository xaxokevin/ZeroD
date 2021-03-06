import { CustomToast } from './../custom-modal/custom-toast';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { AddAlertComponent } from './../customComponent/add-alert/add-alert.component';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { Component, ViewChild, ElementRef} from '@angular/core';
import leaflet from 'leaflet';
import { CustomLoading } from '../custom-modal/custom-loading';
import { ModalController, NavController, Events, Platform } from '@ionic/angular';
import { iAccidente } from '../model/iAccident';
import { iMeteorology } from '../model/iMeteorology';
import { NavegacionService } from '../servicios/navegacion.service';
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx'
import { NetworkService } from '../servicios/network.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';







@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('map') mapContainer: ElementRef;
  mapDark:Boolean;
  ocultaA: Boolean;
  ocultaM: Boolean;
  map: any;
  latitud: any;
  longitud: any;
  listadoMarcaAccidente: iAccidente[] = [];
  listadoMarcaMeteorology: iMeteorology[] = [];
  markerGroupM = leaflet.featureGroup();
  markerGroupA = leaflet.featureGroup();
  manualGMarker = leaflet.featureGroup();
  manualMarker: any;
  colorB: any;
  disablebutton = false;
  /////////////////////////////////////////ICONS//////////////////////////
  lluvia = leaflet.icon({
    iconUrl: '../../assets/icon/weather/rainy.png',
    iconSize: [40, 40], // size of the icon
  });
  nieve = leaflet.icon({
    iconUrl: '../../assets/icon/weather/snow.png',
    iconSize: [40, 40], // size of the icon
  });
  viento = leaflet.icon({
    iconUrl: '../../assets/icon/weather/wind.png',
    iconSize: [40, 40], // size of the icon
  });
  olas = leaflet.icon({
    iconUrl: '../../assets/icon/weather/waves.png',
    iconSize: [30, 30], // size of the icon
  });
  accidente = leaflet.icon({
    iconUrl: '../../assets/icon/traffic/accident.png',
  });
  control = leaflet.icon({
    iconUrl: '../../assets/icon/traffic/control.png',
    iconSize: [30, 30], // size of the icon
  });
  radar = leaflet.icon({
    iconUrl: '../../assets/icon/traffic/radar.png',
    iconSize: [30, 30], // size of the icon
  });
  atasco = leaflet.icon({
    iconUrl: '../../assets/icon/traffic/atasco.png'
  });
  obras = leaflet.icon({
    iconUrl: '../../assets/icon/traffic/obras.png',
    iconSize: [25, 25], // size of the icon
  });
  cloudy = leaflet.icon({
    iconUrl: '../../assets/icon/weather/fog.png',
    iconSize: [40, 40], // size of the icon
  });




/**
 * 
 * @param modalController objeto del controlador del modal
 * @param cmm objeto servicio del custom modal
 * @param cloudS objeto servicio de almacenamiento en la nube
 * @param navCtrl objeto servicio de navegacion
 * @param loading objeto servicio del loading
 * @param openM objejo del servicio de navegacion que establece variables temporales
 * @param nativeStorage objeto del almacenamiento nativo
 * @param netwoekS objeto del servicio que comprueba la conexion a internet o gps
 * @param diagnostic objeto del servicio que comprueba el estado de los elementos nativos
 * @param toast objeto del servicio del custom toast
 * @param translate objeto del servicio de la traducción
 * @param eventCtrl objeto del servio de Events
 * @param androidPermissions objeto del servicio que administra los permisos de android
 */
  constructor(
    public modalController: ModalController,
    private cmm: CustomModalModule,
    private cloudS: CloudserviceService,
    public navCtrl: NavController,
    private loading: CustomLoading,
    private openM: NavegacionService,
    private nativeStorage: NativeStorage,
    private netwoekS: NetworkService,
    private diagnostic: Diagnostic,
    private toast: CustomToast,
    private translate: TranslateService,
    public eventCtrl: Events,
    private androidPermissions: AndroidPermissions,
    private platform: Platform


  ) {
 /*
 Cambiamos el valor del color del boton
 En funcion de la calidad de gps que tengamos.
 Falta implementación
 */
    this.colorB = this.netwoekS.colorN;
  }


  /*este metodo se acciona antes de a entrar en la pagina
    carga el mapa y actualiza las marcas
    Volvemos a comprobar la conexion a internet
  */
  ionViewWillEnter() {
    this.loading.show('');
    this.disablebutton=false;

  /*Cambiamos el valor del color del mapa
    en funcion el tema establecido
 */
  
   //TODO cambiar el mapa segun el color del thema establecido

    this.loadmap();

/*comprueba si existe la variable ocultaA y ocultaM en la memoria del dispositivo
Si no es asi se crea la variable en la memoria y se inicializa en la clase
Si ya existe se obtiene el valor y se asigna a la de la clase
Esta variable es la que nos permite ocultar o habilitar las marcas en el mapa
*/
this.nativeStorage.getItem('ocultaA').then( d => {
      this.ocultaA = d.property;
      console.log(this.ocultaA);
      this.chargeAllMarkAccident(this.ocultaA);
}).catch(e => {

    this.ocultaA = false;
    this.chargeAllMarkAccident(this.ocultaA);
    this.nativeStorage.setItem('ocultaA', {property: false})
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

});

this.nativeStorage.getItem('ocultaM').then((d) => {
      this.ocultaM = d.property;
      console.log(this.ocultaM);
      this.chargeAllMarkMeteorology(this.ocultaM);
}).catch( e => {

  this.ocultaM = false;
  this.chargeAllMarkMeteorology(this.ocultaM);
  this.nativeStorage.setItem('ocultaM', {property: false})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
});

// comprobamos si se ha navegado desde la tab 1
      if (this.openM.getAddM() === true) {
          this.addMark();
          this.openM.setAddM();
      }
    
    this.loading.hide();

  }

  /*Este metodo se acciona cuando se va a cerrar la tab
    establecemos el valor de la variable del servicio a false
  */
  ionViewDidLeave() {
    this.openM.setCargaMapa();
    this.map.remove();
    // TODO cuando salga hay que mirar el valor de la variable del booleano que cambia
    // las marcas para comprobar que valor tiene y cambiarlo al contrario del cual esta almacenado;
    this.nativeStorage.setItem('ocultaM', {property: !this.ocultaM})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
  this.nativeStorage.setItem('ocultaA', {property: !this.ocultaA})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

  }


  /**
   * Funcion encargada de cargar el mapa cuando cambiamos a la tab2
   * Comprueba si se ha navegado desde el modal o desde las tabs
   *
   */
  loadmap() {
    // si el mapa es abierto desde el modal de ver mas informacion de la alerta
    // se establecera la vista encima de la alerta pulsada
    if (this.openM.getCargarMapa() === true) {
      this.map = leaflet.map('map').fitWorld();
      this.map.setView([this.openM.getLatitud(), this.openM.getLongitud()], 14);
      this.map.on('click', (e)=>{
        // Este evento añade una marca a nuestro mapa cuando hacemos clic sobre el
        this.addMark(e.latlng.lat, e.latlng.lng);
      });
      // establecemos los valores a true para mostrar las marcas
    } else {
      // Si el mapa se ha abierto desde los tabs se establecera la vista en general sobre el mapa de españa
      this.map = leaflet.map('map').fitWorld().setView([40.416665, -3.705315], 6);
      this.map.on('click', (e)=>{
        // Este evento añade una marca a nuestro mapa cuando hacemos clic sobre el
        this.addMark(e.latlng.lat, e.latlng.lng);
      });
    }
    // eliminamos el control del zoom
    this.map.removeControl(this.map.zoomControl);
    leaflet.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attributions: '',
          // Establecemos un maximo y un minimo de zoom
      maxZoom: 20,
      minZoom: 5,

    }).addTo(this.map);

    // se añade todo al mapa

  }

  /**
   * Esta funcion es activada cuado pulsamos el boton de localizar en el mapa
   * Primero comprueba si tenemos permisos para acceder al gps del dispositivo
   * Si no es asi no pide permisos
   * Comprueba si tenemos el gps activado o no lanzando un toast
   */
  locateme() {

    if (this.platform.is('android')) {
       // Comprobamos permisos
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission === true) {

          // Comprobacion del GPS si no esta activado, lanza un toast
          // Si el gps esta activado nos situa en nuestra posicion
          this.diagnostic.isGpsLocationAvailable().then((verdad) =>{
            if(verdad === false){
              this.toast.show(this.translate.instant('NoGPS'));
            } else {
              this.map.locate({ setView: true, maxZoom: 15 }).on('locationfound', (e) => {}).on('locationerror', (err) => {
                this.toast.showTop(this.translate.instant('LSGPS'));
              });
            }
          }).catch(e => console.error(e))
        } else {
          // Pedimos permisos
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
        }

      });


    } else {

      this.map.locate({ setView: true, maxZoom: 15 }).on('locationfound', (e) => {}).on('locationerror', (err) => {
        this.toast.showTop(this.translate.instant('LSGPS'));
      });


    }

  }



  /**
   * 
   * Este metodo es el encargado de mostrar en el mapa las ubicaciones de los avisos por meteorologia
   * Se mostraran o no segun el valor del boton del menu de configuracion del mapa
   * Recibe un boleano con esta informacion
   * @param hide boolean
   */
  chargeAllMarkMeteorology(hide: Boolean) {
    if (this.markerGroupM != null) {
      this.map.removeLayer(this.markerGroupM);
    }
    if (hide !== false) {

      // se obtienen las marcas de meteorologia
      this.cloudS.getMarkMeteorology().then(d => {

        this.listadoMarcaMeteorology = d;
        // se crea un grupo de marcas
        this.markerGroupM = leaflet.featureGroup();

        this.listadoMarcaMeteorology.forEach(element => {

          let marker: any;
          let circle: any;
          switch (element.icon) {
            case 'rainy':

           // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker = leaflet.marker([element.latitud, element.longitud], { icon: this.lluvia }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;
            case 'snow':
           // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
           marker = leaflet.marker([element.latitud, element.longitud], { icon: this.nieve }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;
            case 'swap':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker = leaflet.marker([element.latitud, element.longitud], { icon: this.viento }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;
            case 'boat':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker = leaflet.marker([element.latitud, element.longitud], { icon: this.olas }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);


              break;
              case 'cloudy':
              // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
              marker = leaflet.marker([element.latitud, element.longitud], { icon: this.cloudy }).on('click', () => {
              this.map.setView([element.latitud, element.longitud], 15);
            }).bindPopup(element.descripcion);

                break;
            default:
              break;
          }
          // se le asigna un radio de precaucion a la marca
          circle = leaflet.circle([element.latitud, element.longitud], { radius: 2000 }, { color: 'green', opacity: .5 });
          this.markerGroupM.addLayer(marker);
            this.markerGroupM.addLayer(circle);

        });
        // se le añade todas las marcas al mapa
        this.map.addLayer(this.markerGroupM);


      });
    }

    // cambia el valor del booleano recibido
    this.ocultaM = !this.ocultaM;
    this.nativeStorage.setItem('ocultaM', {property: this.ocultaM} );
  }



  /**
   * 
   * Este metodo es el encargado de mostrar en el mapa las ubicaciones de los avisos por meteorologia
   * Se mostraran o no segun el valor del boton del menu de configuracion del mapa
   * Recibe un boleano con esta información
   * @param hide boolean
   */
  chargeAllMarkAccident(hide: Boolean) {

    if (this.markerGroupA != null) {
      this.map.removeLayer(this.markerGroupA);
    }

    if (hide !== false) {

      // se obtienen las marcas de accidente
      this.cloudS.getMarkAccident().then(d => {

        this.listadoMarcaAccidente = d;

        this.markerGroupA = leaflet.featureGroup();


        this.listadoMarcaAccidente.forEach(element => {
          let marker: any;
          switch (element.icon) {
            case 'car':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker =leaflet.marker([element.latitud, element.longitud], { icon: this.accidente }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;

            case 'hand':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker =leaflet.marker([element.latitud, element.longitud], { icon: this.control }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;

            case 'speedometer':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker =leaflet.marker([element.latitud, element.longitud], { icon: this.radar }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

              break;

            case 'hourglass':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker =leaflet.marker([element.latitud, element.longitud], { icon: this.atasco }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);


              break;
            case 'hammer':
            // Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          marker =leaflet.marker([element.latitud, element.longitud], { icon: this.obras }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);


              break;
            default:
              break;
          }

          this.markerGroupA.addLayer(marker);
          // se añade todo al grupo de marcas

        });
        // Se añade al mapa
        this.map.addLayer(this.markerGroupA);

      });

    }

    // Cambiamos el valor del booleano recibido
    this.ocultaA = !this.ocultaA;
    this.nativeStorage.setItem('ocultaA', {property: this.ocultaA} );

  }




  /**
   * Este metodo es el encargado de crear una marca en el lugar señalado por el usuario o
   * añade una marca al pulsar el botón añadir marca en la ubicación del usuario.
   * Comprueba al inicio el estado de los permisos para acceder al GPS
   * Comprueba que el gps este activado
   * Recibe la longitud y la latitud de la pulsación en el mapa
   *  @param mapMark1 latitud de la marca
   *  @param mapMark2 longitud de la marca
   */
  addMark(mapMark1?,mapMark2? ) {
    this.nativeStorage.getItem('user').then(user => {
      this.disablebutton = true;

      if (mapMark1 != null || mapMark2 != null) {

        if (this.manualMarker != null) {
          this.map.removeLayer(this.manualMarker);

        }
        this.manualMarker = leaflet.marker([mapMark1, mapMark2]).on('click', async () => {
        // se llama al metodo que recibe la marca, la latitud y la longitud
           this.touchMark(this.manualMarker,mapMark1 ,mapMark2 );
           });
           this.map.addLayer(this.manualMarker);
      } else {

        if (this.platform.is('android')) {


         // Comprueba permisos
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {

          if(result.hasPermission == true){
            // Comprobacion del GPS si no esta activado, lanza un toast
            // Si el gps esta activado nos añade la marca en la ubicacion actual
            this.diagnostic.isGpsLocationAvailable().then(verdad => {
              if (verdad == false) {
                this.toast.show(this.translate.instant('NoGPS'));
              } else {
                  // te localiza a traves del uso del GPS
                this.map.locate({
                  setView: true, maxZoom: 15
                }).on('locationfound', (e) => {
                  // crea una marca en la localizacion que te encuentras
                  let markerGroup = leaflet.featureGroup();
                  let marker = leaflet.marker([e.latitude, e.longitude]);
                  markerGroup.addLayer(marker);
                  this.map.addLayer(markerGroup);
                  // se llama al metodo que recibe la marca, la latitud y la longitud
                  this.touchMark(marker, e.latitude, e.longitude);
                }).on('locationerror', (err) => {
                  this.toast.showTop(this.translate.instant('LSGPS'))
                });
                  }
            }).catch(e => {
              console.error(e);
              this.disablebutton = false;
            });
          } else {

            // Pedimos permisos
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(result => {

              if ( result.hasPermission === true) {

                this.diagnostic.isGpsLocationAvailable().then(verdad => {
                  if (verdad == false) {
                    this.toast.show(this.translate.instant('NoGPS'));
                  } else {
                      // te localiza a traves del uso del GPS
                    this.map.locate({
                      setView: true, maxZoom: 15
                    }).on('locationfound', (e) => {
                      // crea una marca en la localizacion que te encuentras
                      let markerGroup = leaflet.featureGroup();
                      let marker = leaflet.marker([e.latitude, e.longitude]);
                      markerGroup.addLayer(marker);
                      this.map.addLayer(markerGroup);
                      // se llama al metodo que recibe la marca, la latitud y la longitud
                      this.touchMark(marker, e.latitude, e.longitude);
                    }).on('locationerror', (err) => {
                      this.toast.showTop(this.translate.instant('LSGPS'));
                    });
                      }
                }).catch(e => {
                    console.error(e);
                    this.disablebutton = false;
                  });
              } else {
                this.toast.show(this.translate.instant('GPSS'));
                this.disablebutton = false;
              }
            });

          }
       });
      }
    }
    }).catch(e => {

      if(!this.platform.is('android')){
        this.toast.show(this.translate.instant('browser'));
      }else{
        this.toast.show(this.translate.instant('noUser'));
      }
      
      
    });

  }


  /**
   * Metodo encargado de devolver el estado inicial
   * de los componentes de la vista de la vista cuando
   * el modal se cierra
   */
  onModalClose() {
    // abrimos el loading
    this.loading.show('');
    // eliminamos el mapa
    this.map.remove();
    // lo volvemos a cargar
    this.loadmap();
    // establecemos el valor  del boton en funcion del valor establecido anteriormente 
    // y cargamos las marcas correspondientes
    if (this.ocultaA === true) {

      this.ocultaA = false;
      this.nativeStorage.setItem('ocultaA', {property: this.ocultaA} );
    } else {
      this.ocultaA = true;
      this.nativeStorage.setItem('ocultaA', {property: this.ocultaA} );
    }
    this.chargeAllMarkAccident(this.ocultaA);

    if (this.ocultaM === true) {

      this.ocultaM = false;
      this.nativeStorage.setItem('ocultaM', {property: this.ocultaM} );
    } else {
      this.ocultaM = true;
      this.nativeStorage.setItem('ocultaM', {property: this.ocultaM} );
    }
    this.chargeAllMarkMeteorology(this.ocultaM);

    // cerramos el modal
    this.loading.hide();

  }

  /**
   * Metodo que recibe la marca, la longitud y la latitud de la marca creada vacia
   * Y lanza el modal para añadir un aviso en esa posición
   * @param mark marca que ha sido pulsada en el mapa
   * @param lat latitud de la ubicación de la marca
   * @param lng longitud de la ubicación de la marca
   */
  touchMark(mark: any, lat: any, lng: any) {

     this.cmm.show(AddAlertComponent, lat, lng, this);
     this.disablebutton = false;
  }


  /**
   * Features for the next Version
   */

  
//Si no podemos acceder a nuetro metodo porque estamos fuera de nuestro contexto, hay que hacer un puente de nosotros mismos para poder acceder hasta el
//Esto se consigue haciendo una llamada nosotros, pasandonos this
// en este caso recibimos obj que somos nosotros mismos
//asi podemos acceder a nuesto metodo al estar en el mismo contexto
  // onMapClick(e,obj) {


  
  //   obj.addMark(e.latlng.lat, e.latlng.lng);
   
  //   alert(e.latlng.lat + e.latlng.lng);
  // }








}
