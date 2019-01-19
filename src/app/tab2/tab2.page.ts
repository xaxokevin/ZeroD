
import { WeatherService } from '../servicios/weather.service';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { AddAlertComponent } from './../customComponent/add-alert/add-alert.component';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { Component, ViewChild, ElementRef } from '@angular/core';
import leaflet from 'leaflet';

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
  map: any;
  latitud: any;
  longitud: any;
  listadoMarcaAccidente: iAccidente[] = [];
  listadoMarcaMeteorology: iMeteorology[] = [];

  accidenteIcon = leaflet.icon({
    iconUrl: '../../assets/icon/car.png',
    iconSize: [20, 40], // size of the icon
    
  });

  meteoIcon = leaflet.icon({
    iconUrl: '../../assets/icon/cloud.png',
    iconSize: [20, 40], // size of the icon
   
  });

  //callback: any; Todo


  constructor(public modalController: ModalController, private cmm: CustomModalModule, private cloudS: CloudserviceService, public navCtrl: NavController,
    //private back: BackbuttonService
  ) {
    
  }

  ionViewWillEnter() {

    this.loadmap();
    this.chargeAllMarkMeteorology();
    this.chargeAllMarkAccident();



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
  chargeAllMarkMeteorology(event?) {
    //this.loading.show("");

    this.cloudS.getMarkMeteorology().then(d => {

      this.listadoMarcaMeteorology = d;

      let markerGroup = leaflet.featureGroup();

      this.listadoMarcaMeteorology.forEach(element => {


        let marker: any = leaflet.marker([element.latitud, element.longitud],{icon:this.meteoIcon}).on('click', () => {
          this.map.setView([element.latitud, element.longitud], 15);
          alert(element.descripcion);
        })
        let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 500 }, { color: 'green', opacity: .5 });
        markerGroup.addLayer(marker);
        markerGroup.addLayer(circle);

      });

      this.map.addLayer(markerGroup);
      //this.loading.hide();
      if (event) {
        event.target.complete();
      }
    })

  }


  //Carga todos los avisos de accidentes en la lista de accidentes y los pinta en el mapa
  chargeAllMarkAccident(event?) {
    //this.loading.show("");

    this.cloudS.getMarkAccident().then(d => {

      this.listadoMarcaAccidente = d;

      let markerGroup = leaflet.featureGroup();


      this.listadoMarcaAccidente.forEach(element => {



        let marker: any = leaflet.marker([element.latitud, element.longitud],{icon:this.accidenteIcon}).on('click', () => {
          this.map.setView([element.latitud, element.longitud], 15);
          alert(element.descripcion);
         
        })
        let circle: any = leaflet.circle([element.latitud, element.longitud], { radius: 100 });
        markerGroup.addLayer(marker);
        markerGroup.addLayer(circle);


      });

      this.map.addLayer(markerGroup);
      //this.loading.hide();
      if (event) {
        event.target.complete();
      }
    })



  }







  //Funcion que añade una marca en el mapa de tu ubicacion actual
  addMark() {


    this.map.locate({
      setView: true, maxZoom: 15
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker = leaflet.marker([e.latitude, e.longitude])
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      console.log(e.latitude, e.longitude);
      this.touchMark(marker, e.latitude, e.longitude);

    }).on('locationerror', (err) => {
      alert(err.message);
    })


  }

  touchMark(mark: any, lat: any, lng: any) {

    mark.on('click', async () => {
      alert('Ubicación actual');


      await this.cmm.show(AddAlertComponent, lat, lng, this);
      console.log("Espera realizada");




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
