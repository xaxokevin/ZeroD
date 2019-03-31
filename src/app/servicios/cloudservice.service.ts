import { iMeteorology } from './../model/iMeteorology';
import { iAccidente } from './../model/iAccident';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class CloudserviceService {
  //Variables para las colecciones de firestore

  accidenteCollection: AngularFirestoreCollection<any>;
  meteorologiaCollection: AngularFirestoreCollection<any>;
  key='123456$#@$^@1ERF';
  
  

  /*Variables para el infiniteScroll de la pestaña Accidentes*/
  lastAccidentLoaded = null;  //último accidente cargado
  lastlastAccidentLoaded = null;  //último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollAccidentEnabled = true;  //está el infiniteScroll habilitado porque se haya cumplido lo anterior

  /*Variables para el infiniteScroll de la pestaña Meteorologia*/
  lastMeteorologyLoaded = null;  //último accidente cargado
  lastlastMeteorologyLoaded = null;  //último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollMeteorologyEnabled = true;  //está el infiniteScroll habilitado porque se haya cumplido lo anterior

  isConnected = true;  //saber si estamos con red para realizar conexiones

  private privateKey: string;
  private publicKey: string;
  private enabled: boolean;

  constructor(private fireStore: AngularFirestore) {
    /* Crea una referencia a la colección que empleamos para realizar las
    operaciones CRUD*/
    this.accidenteCollection = fireStore.collection<any>(environment.accidenteColeccion);
    this.meteorologiaCollection = fireStore.collection<any>(environment.meteorologiaColeccion);
    //this.privateKey = config.authentication.rsa.privateKey;
    //this.publicKey = config.authentication.rsa.publicKey;
    //this.enabled = config.authentication.rsa.enabled;
    
  }
/**
 * Crea un nuevo usuario
 * @param email direccion de correo
 * @param pass  contraseña
 */
  createUser(email, pass){
var succesfull;
     firebase.auth().createUserWithEmailAndPassword(email, this.set(this.key, pass)).then(e=> {
       console.log("Usuario creado")}

     ).catch(error=> {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode+": "+ errorMessage)
    });


  }

  /**
   * Login del usuario
   * @param email 
   * @param pass 
   */
  loginUser(email,pass){
    firebase.auth().signInWithEmailAndPassword(email, this.set(this.key, pass)).then(e=>{
      console.log("login succesfull")
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
     
      console.log(errorCode+": "+ errorMessage)
    });
  }

  //The set method is use for encrypt the value.
  set(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  /**
   * Recibe un objeto y lo guarda como un documento nuevo en la colección 'accidente'
   * Devuelve un Promise
   * @param datos documento a insertar en firebase
   * @return AngularFireStoreCollection Devuelve un promise
   */
  
  anadirA(datos) {
    
    return this.accidenteCollection.add(datos).then(e =>{

      console.log("Todo ok")
    }).catch(err =>{

      console.log(err);
    });
  }


  /**
   * Habilita el scroll para la pestaña accidentes
   * @returns devuelve si se ha habilitado el scroll
   */
  
  isInfinityScrollEnabled() {
    return this.scrollAccidentEnabled;
  }


  /**
   * Carga de accidentes en caso de no estar presente la variable reload, se añaden los siguientes 15 al final de la lista 
   * @param reload evento que acciona la carga de mas elementos a la lista
    */
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
        /* Obtengo los primeros 15 accidentes ordenados por descripcion. Para ordenar es necesario
        activar un índice en firebase. Si no se crea dará un error por consola indicando los pasos
        necesarios para crearlo */
        query = this.accidenteCollection.ref.orderBy("hora", "asc").limit(15).get();

      } else {
        /* Cargamos 15 a partir del último cargado */
        query = this.accidenteCollection.ref.orderBy("hora", "asc").startAfter(this.lastAccidentLoaded).limit(15).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { "hora": u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/
          let horaLocal = new Date().valueOf();

          if(x.hora+3600000 <= horaLocal){

            this.accidenteCollection.doc(u.id).delete().then(e => {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });

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
 
      query = this.accidenteCollection.ref.orderBy("hora", "asc").limit(1000).get();

      
      query.then((d) => {
        d.forEach((u) => {
          let x = { "hora": u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          let horaLocal = new Date().valueOf();

          if(x.hora+3600000<= horaLocal){

            this.accidenteCollection.doc(u.id).delete().then(e => {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });
          }else{

            lreq.push(x);

          }
        });
        
        
        resolve(lreq);

      })
    })

  }

/**
 *  Recibe un objeto y lo guarda como un documento nuevo en la colección 'meteorologia'
  Devuelve un Promise
  @param datos documento a insertar en firebase
  @return Devuelve un promise
 */
 
  anadirM(datos) {
    return this.meteorologiaCollection.add(datos).then(e =>{

      console.log("Todo ok")
    }).catch(err =>{

      console.log(err);
    });
  }


  /**
   * Habilita el scroll para la pestaña meteorologia
   * @returns devuelve si se ha habilitado el scroll
   *  */
  misInfinityScrollEnabled() {
    return this.scrollMeteorologyEnabled;
  }

  /**
   * Carga de accidentes en caso de no estar presente la variable reload, se añaden los siguientes 15 al final de la lista
   *  @param reload evento que acciona la carga de mas elementos a la lista
   */
   
   getMeteorology(reload?): Promise<iMeteorology[]> {
    if (reload) {
      this.lastlastMeteorologyLoaded = null;
      this.scrollMeteorologyEnabled = true;
    }
    this.lastMeteorologyLoaded = this.lastlastMeteorologyLoaded;
    return new Promise((resolve, reject) => {
      let lreq: iMeteorology[] = [];
      let query;
      if (this.lastMeteorologyLoaded == null) {
        /* Obtengo los primeros 15 eventos de meteorologia ordenados por descripcion. Para ordenar es necesario
        activar un índice en firebase. Si no se crea dará un error por consola indicando los pasos
        necesarios para crearlo */
        query = this.meteorologiaCollection.ref.orderBy("hora", "asc").limit(15).get();

      } else {
        /* Cargamos 15 a partir del último cargado */
        query = this.meteorologiaCollection.ref.orderBy("hora", "asc").startAfter(this.lastMeteorologyLoaded).limit(15).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { "hora": u.id, ...u.data() };
          let horaLocal = new Date().valueOf();

          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          if(x.hora+3600000<= horaLocal){
            //Se elimina ese aviso
            this.meteorologiaCollection.doc(u.id).delete().then(e => {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });

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


/**
 *  Carga las marcas de meteorologia en el mapa. Como maximo se van a maracar 1000 marcas
 * */
  getMarkMeteorology(): Promise<iMeteorology[]>{

   
    return new Promise((resolve, reject) => {
      let lreq: iMeteorology[] = [];
      let query;
      
        
      query = this.meteorologiaCollection.ref.orderBy("hora", "asc").limit(1000).get();

      
      query.then((d) => {
        d.forEach((u) => {
          let x = { "hora": u.id, ...u.data() };
         
          let horaLocal = new Date().valueOf();
/*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          if(x.hora+3600000<= horaLocal){
           
            this.meteorologiaCollection.doc(u.id).delete().then(e => {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });
          
          }else{
           
            lreq.push(x);

          }
        });
        
        
        resolve(lreq);

      })
    })

  }

}
