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


export class ThemingService {

  
  private themes: Theme[] = [];
  private currentTheme: number = 0;

  constructor(private domCtrl: DomController, @Inject(DOCUMENT) private document,public bar: StatusBar) { 

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
         Color de la ltlng de tab1 */
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
          { themeVariable: '--ion-color-success-contrast', value: '#71A1F0'},

        ]
      }
    ]
  }


  cycleTheme(): void {
 
    if(this.themes.length > this.currentTheme + 1){
      this.currentTheme++;
    } else {
      this.currentTheme = 0;
    }
 
    this.setTheme(this.themes[this.currentTheme].name);
 
  }
 
  setTheme(name): void {
 
    let theme = this.themes.find(theme => theme.name === name);
 
    this.domCtrl.write(() => {
 
      theme.styles.forEach(style => {
        document.documentElement.style.setProperty(style.themeVariable, style.value);
      });
 
    });
 
  }

  changeSkin(light) {
    if (light <10) {
      
      this.setTheme("dark");
      this.bar.backgroundColorByName("primary");
    } else {
     
      this.setTheme("light");
      this.bar.backgroundColorByName("primary");
    }
}

  
}
