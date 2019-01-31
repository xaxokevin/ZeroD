import { CustomToast } from './../custom-modal/custom-toast';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { AddAlertComponent } from './../customComponent/add-alert/add-alert.component';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import leaflet from 'leaflet';
import { CustomLoading } from '../custom-modal/custom-loading';
import { ModalController, NavController } from '@ionic/angular';
import { iAccidente } from '../model/iAccident';
import { iMeteorology } from '../model/iMeteorology';
import { NavegacionService } from '../servicios/navegacion.service';
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx'
import { NetworkService } from '../servicios/network.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';







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

  accidenteIcon = leaflet.icon({
    iconUrl: '../../assets/icon/car.png',
    iconSize: [20, 40], // size of the icon

  });

  meteoIcon = leaflet.icon({
    iconUrl: '../../assets/icon/cloud.png',
    iconSize: [20, 40], // size of the icon

  });




  constructor(
    public modalController: ModalController,
    private cmm: CustomModalModule,
    private cloudS: CloudserviceService,
    public navCtrl: NavController,
    private loading: CustomLoading,
    private openM: NavegacionService,
    private transalte: TranslateService,
    private nativeStorage: NativeStorage,
    private netwoekS: NetworkService,
    private diagnostic: Diagnostic,
    private toast: CustomToast,
    private translate: TranslateService,

  ) {

//comprueba si existe la variable en la memoria del dispositivo
    if(this.nativeStorage.getItem('ocultaA') == null){

      //Creamos la variable si no existe
    this.nativeStorage.setItem('ocultaA', {property: 'true'})
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

    }else{
      this.ocultaA=this.nativeStorage.getItem('ocultaA');
    }
    console.log(this.nativeStorage.getItem('ocultaA'));
    

//Comprobamos si existe la variable en la memoria del dispositivo
  if(this.nativeStorage.getItem('ocultaM') == null){

      //Creamos la variable si no existe
    this.nativeStorage.setItem('ocultaM', {property: 'true'})
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

    }else{
      this.ocultaM=this.nativeStorage.getItem('ocultaM');
    }
    console.log(this.nativeStorage.getItem('ocultaM'));
    

   }

  
 

  ngOnInit(){
    /*
    Comprobamos la conexion a internet al cargar por primera vez
    Si tenemos conexion carga el mapa y las marcas
     */
    if(this.netwoekS.previousStatus == 1){
      console.log("sin conexion")
    }else if(this.netwoekS.previousStatus == 0){
      this.loadmap();
      this.chargeAllMarkMeteorology(this.nativeStorage.getItem('ocultaM'));
      this.chargeAllMarkAccident(this.nativeStorage.getItem('ocultaA'));
    }
    
    

  }
  //este metodo se acciona cuando se vuelve a entrar en la pagina
  //carga el mapa de nuevo y actualiza las marcas
  //Volvemos a comprobar la conexion a internet
  ionViewWillEnter() {
    this.loading.show("");
    if(this.map != null){
      this.map.remove();
    }
    this.loadmap();

    if(this.netwoekS.previousStatus == 1){
      console.log("sin conexion")
    }else if(this.netwoekS.previousStatus == 0){

      if(this.map != null){
        this.map.remove();
      }
      this.loadmap();
      
    }
    this.loading.hide();


  }

  //Este metodo se acciona cuando se va a cerrar la tab
  //establecemos el valor de la variable del servicio a false y eliminamos el mapa para que
  //la aplicacion sea mas fluida
  ionViewDidLeave() {
    this.openM.cargaM = false;
    //this.map.remove();
  }


  //Funcion que carga el mapa 
  loadmap() {
    //si el mapa es abierto desde el modal de ver mas informacion de la alerta
    //se establecera la vista encima de la alerta pulsada
    if (this.openM.cargaM) {
      console.log(this.openM.ltLng[0]);
      console.log(this.openM.ltLng[1]);
      this.map = leaflet.map("map").fitWorld().setView([this.openM.ltLng[0], this.openM.ltLng[1]], 15);
    } else {
      //Si el mapa se ha abierto desde los tabs se establecera la vista en general sobre el mapa de españa
      this.map = leaflet.map("map").fitWorld().setView([40.416665, -3.705315], 6);
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




  //funcion que establece la vista en funcion donde se encuentre el usuario. Obteniendo la localizacion a traves del GPS
  locateme() {

    //Comprobacion del GPS si no esta activado, lanza un toast
    //Si el gps esta activado nos situa en nuestra posicion
    this.diagnostic.isGpsLocationAvailable().then((verdad) =>{
      if(verdad == false){
        this.toast.show(this.translate.instant("NoGPS"));
      }else {
        this.map.locate({ setView: true, maxZoom: 15 });}

    }).catch(e => console.error(e))
     

    
  }

  //Metodo que pinta o no los avisos de meteorologia en el mapa (Recibe un booleano)
  chargeAllMarkMeteorology(hide) {

    this.map.removeLayer(this.markerGroupM);

    if (hide == false) {

      //se elimina las marcas del mapa
      this.map.removeLayer(this.markerGroupM)

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
          let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 500 }, { color: 'green', opacity: .5 });
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
    

  }


  //Metodo que pinta o no los avisos por accidente en el mapa (Recibe un booleano)
  chargeAllMarkAccident(hide) {
    this.map.removeLayer(this.markerGroupA);

    if (hide == false) {

      //se eliminan las marcas del mapa
      this.map.removeLayer(this.markerGroupA)

      

    } else {

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

  }







  //Funcion que añade una marca en el mapa de tu ubicacion actual
  addMark() {
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
          console.log(e.latitude, e.longitude);
          //se llama al metodo que se activa cuando tocas una marca
          //recibe la marca, la latitud y la longitud
          this.touchMark(marker, e.latitude, e.longitude);

        }).on('locationerror', (err) => {
          alert(err.message);
        })
            
          }

    }).catch(e => console.error(e))
     
    
      
    

  }
  //funcion que se activa cuando se cierra el modal
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
      this.nativeStorage.setItem('ocultaA', {property: 'false'} );
    } else {

      console.log("true")
      this.ocultaA = true
      this.nativeStorage.setItem('ocultaA', {property: 'true'} );
    }
    this.chargeAllMarkAccident(this.ocultaA);


    if (this.ocultaM == true) {

      this.ocultaM = false
      console.log("false")
      this.nativeStorage.setItem('ocultaM', {property: 'false'} );
    } else {

      console.log("true")
      this.ocultaM = true
      this.nativeStorage.setItem('ocultaM', {property: 'true'} );
      console.log(this.nativeStorage.getItem('ocultaM'));
    }
    this.chargeAllMarkMeteorology(this.ocultaM);

    //llamamos al metodo para que nos localice
    this.locateme();
    //cerramos el modal
    this.loading.hide();

  }

  //metodo que se inicializa cuando se toca una marca vacia.
  //abre el modal para añadir una nueva
  touchMark(mark: any, lat: any, lng: any) {

    mark.on('click', async () => {
      await this.cmm.show(AddAlertComponent, lat, lng, this);

    })
  }




}
