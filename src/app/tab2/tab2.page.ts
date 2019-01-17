import { CloudserviceService } from './../servicios/cloudservice.service';
import { AddAlertComponent } from './../customComponent/add-alert/add-alert.component';
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { Component, ViewChild, ElementRef } from '@angular/core';
import leaflet from 'leaflet';
import L from 'leaflet';
import { ModalController } from '@ionic/angular';
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
  //callback: any; Todo


  constructor(public modalController: ModalController, private cmm: CustomModalModule, private cloudS: CloudserviceService
    //private back: BackbuttonService
    ){}

    ionViewWillEnter() {
    
    this.loadmap();
    this.chargeAllMarkMeteorology();
    this.chargeAllMarkAccident();

  }

  ionViewDidLeave(){

    this.map.remove();
   
  }



  //Funcion que carga el mapa
  loadmap() {
    console.log("cargando mapa...")
    this.map = leaflet.map("map").fitWorld().setView([40.416665, -3.705315], 6);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20
    }).addTo(this.map);
    this.map.locate({setView: true, watch: true, maxZoom: 15});


  }

  //Carga todos los avisos de meteorologia en el listado meteorologia y los pinta en el mapa
  chargeAllMarkMeteorology(event?) {
    //this.loading.show("");
     
       this.cloudS.getMarkMeteorology().then(d => {
         
         this.listadoMarcaMeteorology = d;
         
         let markerGroup = leaflet.featureGroup();
      
       this.listadoMarcaMeteorology.forEach(element => {


        let marker: any = leaflet.marker([element.latitud, element.longitud]).on('click', () => {
          alert(element.descripcion);
        })
        let circle: any = leaflet.circle([element.latitud, element.longitud],{radius: 100},{color: 'green', opacity:.5});
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

      

        let marker: any = leaflet.marker([element.latitud, element.longitud]).on('click', () => {
          alert(element.descripcion);
        })
        let circle: any = leaflet.circle([element.latitud, element.longitud],{radius: 100});
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
  addMark(){
    
    
    this.map.locate({setView: true, maxZoom: 15
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Ubicación actual');
      
        this.latitud = e.latitude,
        this.longitud=  e.longitude

      
        this.cmm.show(AddAlertComponent, this.latitud,this.longitud, this);
        
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      console.log(e.latitude, e.longitude);
      this.latitud = e.latitude;
      this.longitud = e.longitude;
      }).on('locationerror', (err) => {
        alert(err.message);
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
