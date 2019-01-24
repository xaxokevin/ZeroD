
import { WeatherService } from '../servicios/weather.service';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { AddAlertComponent } from './../customComponent/add-alert/add-alert.component';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { Component, ViewChild, ElementRef } from '@angular/core';
import leaflet from 'leaflet';
import { CustomLoading } from '../custom-modal/custom-loading';
import { ModalController, NavController } from '@ionic/angular';
import { iAccidente } from '../model/iAccident';
import { iMeteorology } from '../model/iMeteorology';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('map') mapContainer: ElementRef;
  ocultaA:boolean;
  ocultaM:boolean;
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

  //callback: any; Todo


  constructor(
    public modalController: ModalController,
    private cmm: CustomModalModule,
    private cloudS: CloudserviceService,
    public navCtrl: NavController,
    private loading: CustomLoading,

    //private back: BackbuttonService
  ) {

    

  }

  ionViewWillEnter() {
    this.ocultaA=true;
    this.ocultaM=true;

    this.loadmap();
    this.chargeAllMarkMeteorology(this.ocultaM);
    this.chargeAllMarkAccident(this.ocultaA);



  }

  ionViewDidLeave() {

    this.map.remove();

  }


  //Funcion que carga el mapa
  loadmap() {
    console.log("cargando mapa...")
    this.map = leaflet.map("map").fitWorld().setView([40.416665, -3.705315], 6);
    this.map.removeControl(this.map.zoomControl);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 5,

    }).addTo(this.map);



  }




  locateme() {
    this.map.locate({ setView: true, maxZoom: 15 });
  }

  //Carga todos los avisos de meteorologia en el listado meteorologia y los pinta en el mapa
  chargeAllMarkMeteorology(hide) {
    

    if(hide == false){

      this.map.removeLayer(this.markerGroupM)
      




    }else{

      this.cloudS.getMarkMeteorology().then(d => {

        this.listadoMarcaMeteorology = d;
  
        this.markerGroupM = leaflet.featureGroup();
  
        this.listadoMarcaMeteorology.forEach(element => {
  
  
          let marker: any = leaflet.marker([element.latitud, element.longitud], { icon: this.meteoIcon }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

          let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 500 }, { color: 'green', opacity: .5 });
          this.markerGroupM.addLayer(marker);
          this.markerGroupM.addLayer(circle);
  
        });
  
        this.map.addLayer(this.markerGroupM);
        
        
      })
    }

    this.ocultaM=!this.ocultaM;
    

    

  }


  //Carga todos los avisos de accidentes en la lista de accidentes y los pinta en el mapa
  chargeAllMarkAccident(hide) {

    if(hide == false){

      this.map.removeLayer(this.markerGroupA)
     

    }else{

      this.cloudS.getMarkAccident().then(d => {

        this.listadoMarcaAccidente = d;
  
      
  
  
        this.listadoMarcaAccidente.forEach(element => {
  
  
  
          let marker: any = leaflet.marker([element.latitud, element.longitud], { icon: this.accidenteIcon }).on('click', () => {
            this.map.setView([element.latitud, element.longitud], 15);
          }).bindPopup(element.descripcion);

          let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 100 });
          this.markerGroupA.addLayer(marker);
          this.markerGroupA.addLayer(circle);
  
  
        });
  
        this.map.addLayer(this.markerGroupA);
        
       
      })

    }
   this.ocultaA=!this.ocultaA;

  }







  //Funcion que añade una marca en el mapa de tu ubicacion actual
  addMark() {


    this.map.locate({
      setView: true, maxZoom: 15
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker = leaflet.marker([e.latitude, e.longitude]);
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      console.log(e.latitude, e.longitude);
      this.touchMark(marker, e.latitude, e.longitude);

    }).on('locationerror', (err) => {
      alert(err.message);
    })


  }
  onModalClose() {
    this.loading.show("");
    console.log("dentro del on modal close");

    this.map.remove();
    this.loadmap();
    this.chargeAllMarkMeteorology(this.ocultaM);
    this.chargeAllMarkAccident(this.ocultaA);
    this.locateme();
    
    this.loading.hide();

  }

  touchMark(mark: any, lat: any, lng: any) {

    mark.on('click', async () => {
      await this.cmm.show(AddAlertComponent, lat, lng, this);

    })
  }


  onLocationFound(e) {
    var radius = e.accuracy / 2;
    leaflet.marker(e.latlng).addTo(this.map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();
    leaflet.circle(e.latlng, radius).addTo(this.map);
  }

  //this.map.on('locationfound', 'onLocationFound');





}
