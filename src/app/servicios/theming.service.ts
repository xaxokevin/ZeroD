import { Injectable, Inject } from '@angular/core';
import { DomController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';


interface Theme {
  name: string;
  styles: ThemeStyle[];
}
 
interface ThemeStyle {
  themeVariable: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Esta clase nos permite hacer un cambio de tema a nuestra aplicacion
 * Este cambio de tema se hará automaticamente ajustandose segun la luminosidad
 * Se ha decidico asi por la politica del modo nocturno automatico implementado en android 9
 */
export class ThemingService {

  
  private themes: Theme[] = [];
  private firstTheme: String = 'light';

  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document,public bar: StatusBar) { 

    //Almacenamos los colores de los temas
    this.themes = [
      {
        name: 'light',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#71A1F0'}, 
          /*
          Color del header y toolbar
          Color del formulario
          Color de fondo de la tabbar
          color de los botones de la tab2
          */
          { themeVariable: '--ion-color-light-shade', value: '#FAFAFA'},
          /*
          Color de fondo de las listas 
          */
          { themeVariable: '--ion-color-secondary', value: '#576070'},
          /*
          Color del icono y texto de la tab bar cuando no estan activos
          */
         { themeVariable: '--ion-color-dark', value: '#222428'},
         /*
         Color del texto en general
         */
         { themeVariable: '--ion-color-medium-tint', value: '#a2a4ab'},
         /*
         Color de la ltlng de tab1 
         */
         { themeVariable: '--ion-color-primary-contrast', value: '#ffffff'},


         { themeVariable: '--ion-color-light-contrast', value: '#ffffff'},
         /*
         Color blanco del titulo de la app, de los modales y del boton cerrar
         */
        { themeVariable: '--ion-color-primary-shade', value: '#71A1F0'},
        /*'
         Color del boton ver mapa
         */
        { themeVariable: '--ion-color-dark-shade', value: '#222442'},
        /*'
         Color del boton del tab sin seleccionar
         */
        { themeVariable: '--ion-color-success-contrast', value: '#ffffff'},
        /*'
         Color del boton add
         */

        ]
      },
      {
        name: 'dark',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#354B70'},
          { themeVariable: '--ion-color-light-shade', value: '#576070'},
          { themeVariable: '--ion-color-secondary', value: '#354B70'},
          { themeVariable: '--ion-color-dark', value: '#ffffff'},
          { themeVariable: '--ion-color-medium-tint', value: '#383a3e;'},
          { themeVariable: '--ion-color-primary-contrast', value: '#354B70'},
          { themeVariable: '--ion-color-light-contrast', value: '#ffffff'},
          { themeVariable: '--ion-color-primary-shade', value: '#ffffff'},
          { themeVariable: '--ion-color-dark-shade', value: '#222442'},
          { themeVariable: '--ion-color-success-contrast', value: '#ffffff'},


        ]
      }
    ]
  }


  
 /**
  * 
  * Este metodo es el encargado de establecer el tema
  * recibe por parametro el nombre del tema y lo busca en
  * nuestro array de temas
  * Luego es aplicado a todas la variables de colores
  * @param name recibe el nombre del tema
  */
  setTheme(name): void {

    let theme = this.themes.find(theme => theme.name === name);

    this.domCtrl.write(() => {

      theme.styles.forEach(style => {
        document.documentElement.style.setProperty(style.themeVariable, style.value);
      });

    });

  }

/**
 * 
 * Este metodo es el encargado de comprobar el cambio de tema
 * Si la luz ambiental es menor a 10 lux se establecera el modo noche
 * Si es mayor el modo dia
 * @param light entero que limita el cambio de tema
 */
  changeSkin(light) {

    if (light <10 && this.firstTheme === 'light') {

        this.setTheme('dark');
        this.firstTheme = 'dark';
        this.bar.backgroundColorByHexString('#354B70');

    } else if(light >10 && this.firstTheme === 'dark') {
     
      this.setTheme('light');
      this.firstTheme = 'light';
      this.bar.backgroundColorByHexString('#71A1F0');
    }
}

  
}
