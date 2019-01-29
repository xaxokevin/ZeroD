import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { iAccidente } from './../model/iAccident';
import { BackbuttonService } from './../servicios/backbutton.service';
import { CloudserviceService } from './../servicios/cloudservice.service';
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSlides} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { iMeteorology } from '../model/iMeteorology';
import { CustomLoading } from '../custom-modal/custom-loading';
import { WeatherService } from '../servicios/weather.service';
import { ViewCardComponent } from '../customComponent/view-card/view-card.component';
import { DomController } from "@ionic/angular";









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

 

  constructor(private route: ActivatedRoute,
    private cloudS: CloudserviceService,
    private loading: CustomLoading,
    private back: BackbuttonService,
    private aemet: WeatherService,
    private cmm: CustomModalModule,
    private domCtrl: DomController
   
  ) {}

  ionViewWillEnter() {
    console.log("ENTRO")
    this.SwipedTabsIndicator = document.getElementById("indicator");
    this.SwipedTabsSlider.length().then(l => {  
      this.ntabs = l;
    });
    console.log("FIn entro");
    //carga los datos de accidente y meteorologia
    this.updateAllAccident(); 
    this.updateAllMeteorology();
    //obtiene los datos de aemet (Falta implementacion)
    this.aemet.getRemoteData();
    console.log(this.listadoAccidentes)
  }
  
  private adjustElementOnScroll(ev) {
    if (ev) {
        console.log(ev);
        this.domCtrl.write(() => {
            let scrollTop: number = ev.scrollTop > 0 ? ev.scrollTop : 0;
           //let scrolldiff: number = scrollTop - this.lastScrollPosition;
            //this.lastScrollPosition = scrollTop;
           // let newValue = this.lastValue + scrolldiff;
            //newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
            //this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
            //this.lastValue = newValue;
        });
    }
}


  //Carga todos los accidentes en el listado accidentes
  //mostramos el loading al iniciar la carga y se quita cuando se complete
  updateAllAccident(event?) {
  this.loading.show("");
    
      this.cloudS.getAccident(true).then(d => {
        
        this.listadoAccidentes = d;
        
        if (event) {
          event.target.complete();
        }
      })

      this.loading.hide();  
      
    
  }

// actualiza la lista de accidentes
//al accionar el refresher
  updateAccident(event?, reload?) {
    if (!event)
      this.loading.show("");
    this.cloudS.getAccident(reload).then(d => {
      
      if (reload) {
        this.listadoAccidentes = d;
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

  //Carga todos los avisos de meteorologia en el listado meteorologia
  updateAllMeteorology(event?) {
     
       this.cloudS.getMeteorology(true).then(d => {
         
         this.listadoMeteorologia = d;
         
         if (event) {
           event.target.complete();
         }
       })
   
   }
 
   //actualiza la lista de avisos por meteorologia al accionar el refresher
   updateMeteorology(event?, reload?) {
     if (!event)
       this.loading.show("");
     this.cloudS.getMeteorology(reload).then(d => {
       
       if (reload) {
         this.listadoMeteorologia = d;
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



  //acciona el modal que muestra la informacion completa de la alerta
  //Recibe por parametros todos los campos de nuestra alerta
  showInfo(descripcion: any, tipo: any, hora: any, latitud: any, longitud:any){

    this.cmm.showInfo(ViewCardComponent, descripcion,tipo, hora, latitud, longitud,this)
  }
  
}
