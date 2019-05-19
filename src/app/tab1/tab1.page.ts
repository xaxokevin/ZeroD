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
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as $ from 'jquery';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  SwipedTabsIndicator: any = null;
  tabs = ['selectTab(0)', 'selectTab(1)'];
  ntabs = 2;
  public category: any = '0';
  listadoAccidentes: iAccidente[] = [];
  listadoMeteorologia: iMeteorology[] = [];
  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
  listMvacia;
  listAvacia;

slidesOpts = {
  grabCursor: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  on: {
    beforeInit: function() {
      const swiper = this;
      swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      const overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true,
      };

      this.params = Object.assign(this.params, overwriteParams);
      this.originalParams = Object.assign(this.originalParams, overwriteParams);
    },
    setTranslate: function() {
      const swiper = this;
      const {
        $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
      } = swiper;
      const params = swiper.params.cubeEffect;
      const isHorizontal = swiper.isHorizontal();
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let wrapperRotate = 0;
      let $cubeShadowEl;
      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
            $wrapperEl.append($cubeShadowEl);
          }
          $cubeShadowEl.css({ height: `${swiperWidth}px` });
        } else {
          $cubeShadowEl = $el.find('.swiper-cube-shadow');
          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
            $el.append($cubeShadowEl);
          }
        }
      }

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        let slideIndex = i;
        if (isVirtual) {
          slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
        }
        let slideAngle = slideIndex * 90;
        let round = Math.floor(slideAngle / 360);
        if (rtl) {
          slideAngle = -slideAngle;
          round = Math.floor(-slideAngle / 360);
        }
        const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
        let tx = 0;
        let ty = 0;
        let tz = 0;
        if (slideIndex % 4 === 0) {
          tx = -round * 4 * swiperSize;
          tz = 0;
        } else if ((slideIndex - 1) % 4 === 0) {
          tx = 0;
          tz = -round * 4 * swiperSize;
        } else if ((slideIndex - 2) % 4 === 0) {
          tx = swiperSize + (round * 4 * swiperSize);
          tz = swiperSize;
        } else if ((slideIndex - 3) % 4 === 0) {
          tx = -swiperSize;
          tz = (3 * swiperSize) + (swiperSize * 4 * round);
        }
        if (rtl) {
          tx = -tx;
        }

         if (!isHorizontal) {
          ty = tx;
          tx = 0;
        }

// tslint:disable-next-line: max-line-length
         const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
        if (progress <= 1 && progress > -1) {
          wrapperRotate = (slideIndex * 90) + (progress * 90);
          if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
        }
        $slideEl.transform(transform$$1);
        if (params.slideShadows) {
          // Set shadows
          let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if (shadowBefore.length === 0) {
            shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $slideEl.append(shadowBefore);
          }
          if (shadowAfter.length === 0) {
            shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $slideEl.append(shadowAfter);
          }
          if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
        }
      }
      $wrapperEl.css({
        '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
        '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
        '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
        'transform-origin': `50% 50% -${swiperSize / 2}px`,
      });

       if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
        } else {
          const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
          const multiplier = 1.5 - (
            (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
            + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
          );
          const scale1 = params.shadowScale;
          const scale2 = params.shadowScale / multiplier;
          const offset$$1 = params.shadowOffset;
          $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
        }
      }

      const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
      $wrapperEl
        .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
    },
    setTransition: function(duration) {
      const swiper = this;
      const { $el, slides } = swiper;
      slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
      if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
        $el.find('.swiper-cube-shadow').transition(duration);
      }
    },
  }
}

/**
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
    private geolocation: Geolocation,
    private sanitizer: DomSanitizer,

  ) {}

  /**
   * Metodo que comprueba la posicion del slider y la conexion a internet
   * cada vez que entra a la tab1
   */
  ionViewWillEnter() {
    // Comprobamos la posicion del slider
    this.SwipedTabsIndicator = document.getElementById('indicator');
    this.SwipedTabsSlider.length().then(l => {
      this.ntabs = l;
    });
    // Comprobamos la conexion a internet
    if (this.netwoekS.previousStatus === 1) {
    } else if (this.netwoekS.previousStatus === 0) {
      this.updateAllAccident();
      this.updateAllMeteorology();
      // obtiene los datos del weather service (Falta implementacion)
      //this.aemet.getRemoteData();
      //
    this.geolocation.getCurrentPosition().then(location =>{
      let geoLocation ={
        lat: location.coords.latitude,
        long: location.coords.longitude
      }
      this.cloudS.myLocation(geoLocation);
    });
    }
  }

  /**
   * Se encarga de comprobar si las listas estan vacias
   * cuando es asi muestra la imagen de que todo esta ok
   */
  checkListA() {
    if (this.listadoAccidentes.length === 0) {
      this.listAvacia = true;
    } else {
      this.listAvacia = false;
    }
  }

/**
   * Se encarga de comprobar si las listas estan vacias
   * cuando es asi muestra la imagen de que todo esta ok
   */
  checkListM() {
    if (this.listadoMeteorologia.length === 0) {
      this.listMvacia = true;
    } else {
      this.listMvacia = false;
    }
  }


  /**
   * Metodo de carga de los accidentes, se activa cuando se entra en la tab1
   * Muestra un loading que se quita cuando la carga desde firebase esta completa
   * @param event evento que desencadena el metodo
   */
  updateAllAccident(event?) {
    // Cargamos de la bd
    this.loading.show('');
      this.cloudS.getAccident(true).then(d => {
        this.listadoAccidentes = d;

        this.checkListA();
        this.updateAccident(event,true)

        if (event) {
          event.target.complete();
        }
        this.loading.hide();
      });


  }

/**
 * Se activa cuando accionamos el refresher de la lista.
 * Carga los accidentes nuevos que se han añadido
 * @param event evento que desencadena el metodo
 * @param reload evento que activa la carga de la bd
 */
  updateAccident(event?, reload?) {
    this.cloudS.getAccident(reload).then(d => {
      if (reload) {
        this.listadoAccidentes = d;
        this.checkListA();
      } else {
        d.forEach((u) => {
          this.listadoAccidentes.push(u);

        });
      }
      if (event) {
        event.target.complete();
      }
      this.ionInfiniteScroll.disabled = !this.cloudS.isInfinityScrollEnabled();
    });
  }

   /**
   * Metodo de carga de la meteorologia, se activa cuando se entra en la tab1
   * Muestra un loading que se quita cuando la carga desde firebase esta completa
   * @param event evento que desencadena el metodo
   */
  updateAllMeteorology(event?) {
       this.cloudS.getMeteorology(true).then(d => {
         this.listadoMeteorologia = d;

         this.checkListM();
         this.updateMeteorology(event,true)
         if (event) {
           event.target.complete();
         }
       });
   }

  /**
 * Se activa cuando accionamos el refresher de la lista.
 * Carga la meteorologia nueva que se han añadido
 * @param event evento que desencadena el metodo
 * @param reload evento que activa la carga de la bd
 */
   updateMeteorology(event?, reload?) {
     if (!event) {
     
     }
     this.cloudS.getMeteorology(reload).then(d => {
       if (reload) {
         this.listadoMeteorologia = d;
         this.checkListM();
       } else {
         d.forEach((u) => {
           this.listadoMeteorologia.push(u);
         });
       }
       if (!event) {

       }
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
      this.category = +this.category; // to int;
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
    if (this.SwipedTabsIndicator) {
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
    }
  }



  /**
   * Acciona el modal que muestra la informacion completa de la alerta
   * Recibe por parametros todos los campos de nuestra alerta
   * @param descripcion descripcion de la alerta
   * @param tipo tipo de alerta recibida
   * @param hora hora en la que se creo el evento
   * @param ciudad de la ubicación del evento
   * @param calle de la ubicación del evento
   * Estas dos variables representan la ubicacion
   */

  showInfo(descripcion: any, tipo: any, hora: any, ciudad: any, calle: any) {

    this.cmm.showInfo(ViewCardComponent, descripcion, tipo, hora, ciudad, calle, this);
  }

  /**
   * Metodo que inicia la navegacion hasta el mapa
   * añadiendo una marca
   */
  anadeMarca() {
    this.navegacion.addTab1Mark(true);
    this.router.navigate(['/tabs/tab2']);
  }

  /**
   * Metodo que abre el modal de ayuda
   */
   presentModal() {
    this.cmm.showHelp(HelpComponent, this);

  }

  /**
   * Metodo que convierte a una img segura nuestra cadena en base64
   * @param img imagen a recibir
   * @return this.sanitizer.bypassSecurityTrustUrl(img)
   */
  safeImage(img){
    return this.sanitizer.bypassSecurityTrustUrl(img)
  }
}
