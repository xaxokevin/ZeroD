import { iMeteorology } from './../model/iMeteorology';
import { iAccidente } from './../model/iAccident';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudserviceService {
  //Variables para las colecciones de firestore

  accidenteCollection: AngularFirestoreCollection<any>;
  meteorologiaCollection: AngularFirestoreCollection<any>;
  hora:any;
  

  /*Variables para el infiniteScroll de la pestaña Accidentes*/
  lastAccidentLoaded = null;  //último accidente cargado
  lastlastAccidentLoaded = null;  //último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollAccidentEnabled = true;  //está el infiniteScroll habilitado porque se haya cumplido lo anterior

  /*Variables para el infiniteScroll de la pestaña Meteorologia*/
  lastMeteorologyLoaded = null;  //último accidente cargado
  lastlastMeteorologyLoaded = null;  //último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollMeteorologyEnabled = true;  //está el infiniteScroll habilitado porque se haya cumplido lo anterior

  isConnected = true;  //saber si estamos con red para realizar conexiones

  constructor(private fireStore: AngularFirestore) {
    /* Crea una referencia a la colección que empleamos para realizar las
    operaciones CRUD*/
    this.accidenteCollection = fireStore.collection<any>(environment.accidenteColeccion);
    this.meteorologiaCollection = fireStore.collection<any>(environment.meteorologiaColeccion);
    


  }
  /*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'accidente'
  Devuelve un Promise
  */
  anadirA(datos) {
    console.log("Accidente añadido");
    return this.accidenteCollection.add(datos);
  }


  //Habilita el scroll para la pestaña accidentes
  isInfinityScrollEnabled() {
    return this.scrollAccidentEnabled;
  }


  /* Carga de accidentes en caso de no estar presente la variable reload, se añaden los siguientes
   10 al final de la lista */
  getAccident(reload?): Promise<iAccidente[]> {
    if (reload) {
      this.lastlastAccidentLoaded = null;
      this.scrollAccidentEnabled = true;
    }
    this.lastAccidentLoaded = this.lastlastAccidentLoaded;
    return new Promise((resolve, reject) => {
      let lreq: iAccidente[] = [];
      let query;
      if (this.lastAccidentLoaded == null) {
        /* Obtengo los primeros 10 accidentes ordenados por descripcion. Para ordenar es necesario
        activar un índice en firebase. Si no se crea dará un error por consola indicando los pasos
        necesarios para crearlo */
        query = this.accidenteCollection.ref.orderBy("descripcion", "asc").limit(10).get();

      } else {
        /* Cargamos 10 a partir del último cargado */
        query = this.accidenteCollection.ref.orderBy("descripcion", "asc").startAfter(this.lastAccidentLoaded).limit(10).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { "descripcion": u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/
          let horaLocal = new Date().valueOf();

          if(x.hora+3600000 <= horaLocal){

          }else{
  
            lreq.push(x);

          }

          
        });
        this.lastlastAccidentLoaded = d.docs[d.docs.length - 1];
        if (d.docs.length < 10) {
          this.scrollAccidentEnabled = false;
        }
        
        
        resolve(lreq);

      })
    })
  }

  /* Carga de accidentes en el mapa (Crea los marcadores) unicamente se mostraran hasta 1000 avisos*/
  getMarkAccident(): Promise<iAccidente[]>{

    return new Promise((resolve, reject) => {
      let lreq: iAccidente[] = [];
      let query;
 
      query = this.accidenteCollection.ref.orderBy("descripcion", "asc").limit(1000).get();

      
      query.then((d) => {
        d.forEach((u) => {
          let x = { "descripcion": u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          let horaLocal = new Date().valueOf();

          if(x.hora+3600000<= horaLocal){

          }else{

            lreq.push(x);

          }
        });
        
        
        resolve(lreq);

      })
    })

  }

/*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'meteorologia'
  Devuelve un Promise
  */
  anadirM(datos) {
    console.log("Meteo añadido");
    return this.meteorologiaCollection.add(datos);
  }


  //Habilita el scroll para la pestaña meteorologia
  misInfinityScrollEnabled() {
    return this.scrollMeteorologyEnabled;
  }

  /* Carga de accidentes en caso de no estar presente la variable reload, se añaden los siguientes
   10 al final de la lista */
   getMeteorology(reload?): Promise<iAccidente[]> {
    if (reload) {
      this.lastlastMeteorologyLoaded = null;
      this.scrollMeteorologyEnabled = true;
    }
    this.lastMeteorologyLoaded = this.lastlastMeteorologyLoaded;
    return new Promise((resolve, reject) => {
      let lreq: iAccidente[] = [];
      let query;
      if (this.lastMeteorologyLoaded == null) {
        /* Obtengo los primeros 10 accidentes ordenados por descripcion. Para ordenar es necesario
        activar un índice en firebase. Si no se crea dará un error por consola indicando los pasos
        necesarios para crearlo */
        query = this.meteorologiaCollection.ref.orderBy("descripcion", "asc").limit(10).get();

      } else {
        /* Cargamos 10 a partir del último cargado */
        query = this.meteorologiaCollection.ref.orderBy("descripcion", "asc").startAfter(this.lastMeteorologyLoaded).limit(10).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { "descripcion": u.id, ...u.data() };
          let horaLocal = new Date().valueOf();

          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          if(x.hora+3600000<= horaLocal){

          }else{
            
            lreq.push(x);
          }
        });
        this.lastlastMeteorologyLoaded = d.docs[d.docs.length - 1];
        if (d.docs.length < 10) {
          this.scrollMeteorologyEnabled = false;
        }
        
        
        resolve(lreq);

      })
    })
  }


//Carga las marcas de meteorologia en el mapa. Como maximo se van a maracar 1000 marcas
  getMarkMeteorology(): Promise<iAccidente[]>{

   
    return new Promise((resolve, reject) => {
      let lreq: iAccidente[] = [];
      let query;
      
        
      query = this.meteorologiaCollection.ref.orderBy("descripcion", "asc").limit(1000).get();

      
      query.then((d) => {
        d.forEach((u) => {
          let x = { "descripcion": u.id, ...u.data() };

          let horaLocal = new Date().valueOf();
/*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          if(x.hora+3600000<= horaLocal){

          }else{
           
            lreq.push(x);

          }
        });
        
        
        resolve(lreq);

      })
    })

  }

}
