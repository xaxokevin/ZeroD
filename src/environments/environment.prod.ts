// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebaseConfig: {

    apiKey: "AIzaSyB0njO8_XGXzeeA72OkV5RnVHJOt_SAZN8",
    authDomain: "zerod-66498.firebaseapp.com",
    databaseURL: "https://zerod-66498.firebaseio.com",
    projectId: "zerod-66498",
    storageBucket: "zerod-66498.appspot.com",
    messagingSenderId: "158118334238",
    
    

  },

  accidenteColeccion: "accidente",
  meteorologiaColeccion: "meteorologia",
  timemaxloading:1000, //Tiempo máximo que puede estar cargando la aplicación, supera deja de cargar y muestra error en carga
  

  
  
  

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.