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
  ocultaA: any;
  ocultaM: any;
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
  chekPer: any;

  accidenteIcon = leaflet.icon({
    iconUrl: '../../assets/icon/car.png',
    iconSize: [20, 40], // size of the icon

  });

  meteoIcon = leaflet.icon({
    iconUrl: '../../assets/icon/cloud.png',
    iconSize: [20, 40], // size of the icon

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
    this.colorB=this.netwoekS.colorN;
    
  }


  /*este metodo se acciona cuando se vuelve a entrar en la pagina
    *carga el mapa de nuevo y actualiza las marcas
    Volvemos a comprobar la conexion a internet
  */
  ionViewWillEnter() {
    this.loading.show("");
  /*Cambiamos el valor del color del icono de señal
    En funcion de la calidad de gps que tengamos.
 */
    this.colorB=this.netwoekS.colorN;


//Se comprueba la conexión a internet y se hacen las respectivas operaciones segun tengamos o no activada la conexion
    
    if(this.netwoekS.previousStatus == 1){
      this.loadmap();
    }else if(this.netwoekS.previousStatus == 0){

      this.loadmap();
/*comprueba si existe la variable ocultaA y ocultaM en la memoria del dispositivo
Si no es asi se crea la variable en la memoria y se inicializa en la clase
Si ya existe se obtiene el valor y se asigna a la de la clase
Esta variable es la que nos permite ocultar o habilitar las marcas en el mapa
*/
this.nativeStorage.getItem('ocultaA').then((d)=>{
  if(d==null){
    this.ocultaA=false;
    this.chargeAllMarkAccident(this.ocultaA);
    this.nativeStorage.setItem('ocultaA', {property: 'false'})
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }else{
      this.ocultaA=d;
      this.nativeStorage.setItem('ocultaA', {property: this.ocultaA})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      this.chargeAllMarkAccident(this.ocultaA);
  }

  this.nativeStorage.getItem('ocultaM').then((d)=>{
    if(d==null){
      this.ocultaM=false;
      this.chargeAllMarkMeteorology(this.ocultaM);
      this.nativeStorage.setItem('ocultaM', {property: 'false'})
      
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    }else{
        this.ocultaM=d;
        
        this.chargeAllMarkMeteorology(this.ocultaM);
        this.nativeStorage.setItem('ocultaM', {property: this.ocultaM})
      
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    }

  });
});
      

      if(this.openM.getAddM()==true){
        
          this.addMark();
          this.openM.setAddM();
      }
      
      
    }
    this.loading.hide();


  }

  /*Este metodo se acciona cuando se va a cerrar la tab
    establecemos el valor de la variable del servicio a false
  */
  ionViewDidLeave() {
    this.openM.setCargaMapa();
    this.map.remove();
   

  }


  /**
   * Funcion encargada de cargar el mapa cuando cambiamos a la tab2
   * Comprueba si se ha navegado desde el modal o desde las tabs
   *
   */
  loadmap() {
    //si el mapa es abierto desde el modal de ver mas informacion de la alerta
    //se establecera la vista encima de la alerta pulsada
    if (this.openM.getCargarMapa()==true) {
      this.map = leaflet.map("map").fitWorld().setView([this.openM.getLatitud(), this.openM.getLongitud()], 15);
      //this.map.on('click', this.onMapClick)
      //establecemos los valores a true para mostrar las marcas
      
      
    } else {
      //Si el mapa se ha abierto desde los tabs se establecera la vista en general sobre el mapa de españa
      this.map = leaflet.map("map").fitWorld().setView([40.416665, -3.705315], 6);
      this.map.on('click', (e)=>{
        //Este evento añade una marca a nuestro mapa cuando hacemos clic sobre el
        this.addMark(e.latlng.lat, e.latlng.lng);
        //this.onMapClick(e,this);
      })
    }
    //eliminamos el control del zoom
    this.map.removeControl(this.map.zoomControl);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      //Establecemos un maximo y un minimo de zoom
      maxZoom: 20,
      minZoom: 5,

    }).addTo(this.map);
   

    //se añade todo al mapa

  }




  /**
   * Esta funcion es activada cuado pulsamos el boton de localizar en el mapa
   * Primero comprueba si tenemos permisos para acceder al gps del dispositivo
   * Si no es asi no pide permisos
   * Comprueba si tenemos el gps activado o no lanzando un toast
   */
  locateme() {

    if (this.platform.is('android')){

      console.log("sigo entrando aqui jaja");


       //Comprobamos permisos
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        console.log('Has permission?',result.hasPermission);
        this.chekPer = result.hasPermission;


        if(this.chekPer == true){

          //Comprobacion del GPS si no esta activado, lanza un toast
          //Si el gps esta activado nos situa en nuestra posicion
          this.diagnostic.isGpsLocationAvailable().then((verdad) =>{
            if(verdad == false){
              this.toast.show(this.translate.instant("NoGPS"));
            }else {
              
              this.map.locate({ setView: true, maxZoom: 15 }).on('locationfound', (e) => {  
      
              }).on('locationerror', (err) => {
                //alert(err.message);
                this.toast.showTop(this.translate.instant("LSGPS"))
              });
            
            }
      
          }).catch(e => console.error(e))
        }else{
          //Pedimos permisos
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
      
        }

      });


    }else{

      this.map.locate({ setView: true, maxZoom: 15 }).on('locationfound', (e) => {  
      
      }).on('locationerror', (err) => {
        //alert(err.message);
        this.toast.showTop(this.translate.instant("LSGPS"))
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
  chargeAllMarkMeteorology(hide) {
    if(this.markerGroupM != null){
      this.map.removeLayer(this.markerGroupM)

    }

    if (hide == false) {

      //se elimina las marcas del mapa
     

    } else {

     

      //se obtienen las marcas de meteorologia
      this.cloudS.getMarkMeteorology().then(d => {

        this.listadoMarcaMeteorology = d;
        //se crea un grupo de marcas
        this.markerGroupM = leaflet.featureGroup();

        this.listadoMarcaMeteorology.forEach(element => {

          //Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          let marker: any = leaflet.marker([element.latitud, element.longitud], { icon: this.meteoIcon }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

          //se le asigna un radio de precaucion a la marca
          let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 2000 }, { color: 'green', opacity: .5 });
          //se añade todo al grupo de marcas
          this.markerGroupM.addLayer(marker);
          this.markerGroupM.addLayer(circle);

        });
        //se le añade todas las marcas al mapa
        this.map.addLayer(this.markerGroupM);


      })
    }

    //cambia el valor del booleano recibido
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
  chargeAllMarkAccident(hide) {

    if(this.markerGroupA != null){
      this.map.removeLayer(this.markerGroupA)

    }
    

    if (hide == false) {

     //No se cargan las marcas
  

      
    } else {
      //this.map.removeLayer(this.markerGroupA);

      //se obtienen las marcas de accidente
      this.cloudS.getMarkAccident().then(d => {

        this.listadoMarcaAccidente = d;

        this.markerGroupA = leaflet.featureGroup();


        this.listadoMarcaAccidente.forEach(element => {

          //Se crea la marca y se le asigna a esa marca un pop up con la descripcion
          let marker: any = leaflet.marker([element.latitud, element.longitud], { icon: this.accidenteIcon }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

          this.markerGroupA.addLayer(marker);
          //se añade todo al grupo de marcas

        });
        //Se añade al mapa
        this.map.addLayer(this.markerGroupA);

      })

    }

    //Cambiamos el valor del booleano recibido 
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


    if(mapMark1 != null || mapMark2 != null){

      if(this.manualMarker != null){

        this.map.removeLayer(this.manualMarker);

      } 

        // this.map.removeLayer(this.manualMarker);
        this.manualMarker = leaflet.marker([mapMark1, mapMark2]).on('click', async () => {

          //se llama al metodo que recibe la marca, la latitud y la longitud
         this.touchMark(this.manualMarker,mapMark1 ,mapMark2 );
     
         });
         //this.manualMarker.addLayer(marker);
         this.map.addLayer(this.manualMarker);
      

    }else{

      if (this.platform.is('android')){


        //Comprueba permisos
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        this.chekPer = result.hasPermission;
        if(this.chekPer == true){
          //Comprobacion del GPS si no esta activado, lanza un toast
          //Si el gps esta activado nos añade la marca en la ubicacion actual
          this.diagnostic.isGpsLocationAvailable().then((verdad) =>{
            if(verdad == false){
              this.toast.show(this.translate.instant("NoGPS"));
            }else {
                //te localiza a traves del uso del GPS
              this.map.locate({
                setView: true, maxZoom: 15
              }).on('locationfound', (e) => {
                //crea una marca en la localizacion que te encuentras
                let markerGroup = leaflet.featureGroup();
                let marker = leaflet.marker([e.latitude, e.longitude]);
                markerGroup.addLayer(marker);
                this.map.addLayer(markerGroup);
                //se llama al metodo que recibe la marca, la latitud y la longitud
                this.touchMark(marker, e.latitude, e.longitude);
      
              }).on('locationerror', (err) => {
                //alert(err.message);
                this.toast.showTop(this.translate.instant("LSGPS"))
              })
                  
                }
      
          }).catch(e => console.error(e))
        }else{
      
          //Pedimos permisos
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
      
        }
     });
    }else{
        //te localiza a traves del uso del GPS
        this.map.locate({
          setView: true, maxZoom: 15
        }).on('locationfound', (e) => {
          //crea una marca en la localizacion que te encuentras
          let markerGroup = leaflet.featureGroup();
          let marker = leaflet.marker([e.latitude, e.longitude]);
          markerGroup.addLayer(marker);
          this.map.addLayer(markerGroup);
          //se llama al metodo que recibe la marca, la latitud y la longitud
          this.touchMark(marker, e.latitude, e.longitude);

        }).on('locationerror', (err) => {
          //alert(err.message);
          this.toast.showTop(this.translate.instant("LSGPS"))
        })
    }

      }
    
     
  }


  /**
   * Metodo encargado de devolver el estado inicial 
   * de los componentes de la vista de la vista cuando
   * el modal se cierra
   */
  onModalClose() {
    //abrimos el loading
    this.loading.show("");
    //eliminamos el mapa
    this.map.remove();
    //lo volvemos a cargar
    this.loadmap();
    //establecemos el valor  del boton en funcion del valor establecido anteriormente 
    //y cargamos las marcas correspondientes
    if (this.ocultaA == true) {

      this.ocultaA = false
      console.log("false")
      this.nativeStorage.setItem('ocultaA', {property: this.ocultaA} );
    } else {

      console.log("true")
      this.ocultaA = true
      this.nativeStorage.setItem('ocultaA', {property: this.ocultaA} );
    }
    this.chargeAllMarkAccident(this.ocultaA);

    if (this.ocultaM == true) {

      this.ocultaM = false
      console.log("false")
      this.nativeStorage.setItem('ocultaM', {property: this.ocultaM} );
    } else {

      console.log("true")
      this.ocultaM = true
      this.nativeStorage.setItem('ocultaM', {property: this.ocultaM} );
      console.log(this.nativeStorage.getItem('ocultaM'));
    }
    this.chargeAllMarkMeteorology(this.ocultaM);

    //llamamos al metodo para que nos localice
    this.locateme();
    //cerramos el modal
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
