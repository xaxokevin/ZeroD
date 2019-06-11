import { iMeteorology } from './../model/iMeteorology';
import { iAccidente } from './../model/iAccident';
import { iUser } from './../model/iUser';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase';
import * as CryptoJS from 'crypto-js';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class CloudserviceService {
  // Variables para las colecciones de firestore

  accidenteCollection: AngularFirestoreCollection<any>;
  meteorologiaCollection: AngularFirestoreCollection<any>;
  userCollection: AngularFirestoreCollection<any>;
  key= '123456$#@$^@1ERF';
  

  /*Variables para el infiniteScroll de la pestaña Accidentes*/
  lastAccidentLoaded = null;  // último accidente cargado
  lastlastAccidentLoaded = null;  // último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollAccidentEnabled = true;  // está el infiniteScroll habilitado porque se haya cumplido lo anterior

  /*Variables para el infiniteScroll de la pestaña Meteorologia*/
  lastMeteorologyLoaded = null;  // último accidente cargado
  lastlastMeteorologyLoaded = null;  // último cargado esta vez, si es igual al anterior, entonces no hay más que cargar
  scrollMeteorologyEnabled = true;  // está el infiniteScroll habilitado porque se haya cumplido lo anterior

  isConnected = true;  // saber si estamos con red para realizar conexiones

  user: any;
  distance: Number;
  location: any;

  constructor(private fireStore: AngularFirestore,
    private nativeStorage: NativeStorage,
    public router: Router,
    ) {
    /* Crea una referencia a la colección que empleamos para realizar las
    operaciones CRUD*/
    this.accidenteCollection = fireStore.collection<any>(environment.accidenteColeccion);
    this.meteorologiaCollection = fireStore.collection<any>(environment.meteorologiaColeccion);
    this.userCollection = fireStore.collection<any>(environment.userColeccion);

  }
///////////////////////////////////////////////////////////USUARIOS////////////////////////////////////////////////////////////////////////
/**
 * Crea un usuario nuevo en la aplicación
 * @param img String foto de perfil
 * @param user String nombre de usuario
 * @param email String correo 
 * @param pass String contraseña
 */
  createUser(img, user, email, pass) {

    let datos = {
      img,
      user,
      email
    }

    // creamos el usuario
     firebase.auth().createUserWithEmailAndPassword(email, this.set(this.key, pass)).then(e => {
       console.log('Usuario creado');
       // si la respuesta es correcta  lo añadimos al almacenamiento nativo
       this.nativeStorage.setItem('user', {email: email, img: img , user: user} )
       .then(
         () => console.log('Stored item!'),
         error => console.error('Error storing item', error)
       );

       return this.userCollection.add(datos).then(e => {

        console.log('Todo ok');
      }).catch(err => {
        console.log(err);
      });

      }

     ).catch(error=> {
       // si la respuesta es incorrecta muestra mensaje error
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode + ': ' + errorMessage);
    });

  }
  

  /**
   * Obtiene el perfil del usuario
   * @param email String identificador unico de cada usuario
   */
  getProfile(email): Promise<iUser[]> {

    return new Promise((resolve) => {
    let lreq: iUser[] = [];
    let query;
    query = this.userCollection.ref.where('email', '==', email).get();

    query.then(snapshot => {

      snapshot.forEach( doc => {
        let x = { 'email': doc.id , ...doc.data()};
        lreq.push(x);
      });
      console.log(lreq.length)
      resolve(lreq);
    }
      );
  });

  }

  /**
   * Login del usuario
   * @param email String identificador unico de cada usuario
   * @param pass String contraseña
   */
  loginUser(email,pass){
    firebase.auth().signInWithEmailAndPassword(email, this.set(this.key, pass)).then(e =>{
      this.getProfile(email).then(user => {

        this.nativeStorage.setItem('user', {email: user[0].email, img: user[0].img, user: user[0].user } )
       .then(
         () => this.router.navigate(['/tabs/tab1']),
         error => console.error('Error storing item', error)
       );
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      this.toast.show(this.translate.instant('existUser'));
    });
  }

  /**
   * obtiene el numero de alertas activas que tiene el usuario
   * @param email identificador del usuario
   * @return Promise con el numero de alertas activas
   */
  getNumberOfAlert(email): Promise<Number> {

    return new Promise((resolve) => {
      let lreqM: iMeteorology [] = [];
      let lreqA: iAccidente [] = [];
      let query;
      let query2;
      var n = 0;

      query = this.meteorologiaCollection.ref.where('user', '==', email).get();
      query.then(snapshot => {
        snapshot.forEach( doc => {
          let x = { 'user': doc.id , ...doc.data()};
          lreqM.push(x);
        });
        n += lreqM.length;
      }
        );

        query2 = this.accidenteCollection.ref.where('user', '==', email).get();
        query2.then(snapshot => {
          snapshot.forEach( doc => {
            let x = { 'user': doc.id , ...doc.data()};
            lreqA.push(x);
          });
          n += lreqA.length;
          resolve(n);
        }
          );
    });

  }

  /**
   * Metodo que encripta la contraseña del usuario
   * @param keys String con el formato en el que se va encriptar
   * @param value String valor de la contraseña
   * @returns String con el valor encriptado de la contraseña
   */
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

  /**
   * Metodo que desencripta la contraseña del usuario
   * @param keys String con el formato en el que se va desencriptar
   * @param value String valor de la contraseña
   * @returns String con el valor desencriptado de la contraseña
   */
  get(keys, value) {
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

  myLocation(latlong){
    this.location = latlong
  }

/////////////////////////////////////////OBTENCION, ADICCION, MODIFICACION Y ELIMINACION DE DATOS EN FIREBASE/////////////////////////////////////

  /**
   * Recibe un objeto y lo guarda como un documento nuevo en la colección 'accidente'
   * Devuelve un Promise
   * @param datos documento a insertar en firebase
   * @return AngularFireStoreCollection Devuelve un promise
   */
  anadirA(datos) {
    return this.accidenteCollection.add(datos).then(e => {

      console.log('Todo ok');
    }).catch(err => {

      console.log(err);
    });
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
    return new Promise((resolve) => {
      let lreq: iAccidente[] = [];
      let query;
      if (this.lastAccidentLoaded == null) {
        /* Obtengo los primeros 15 accidentes ordenados por descripcion. Para ordenar es necesario
        activar un índice en firebase. Si no se crea dará un error por consola indicando los pasos
        necesarios para crearlo */
        query = this.accidenteCollection.ref.orderBy('hora', 'asc').limit(15).get();

      } else {
        /* Cargamos 15 a partir del último cargado */
        query = this.accidenteCollection.ref.orderBy('hora', 'asc').startAfter(this.lastAccidentLoaded).limit(15).get();
      }
      query.then((d) => {
        d.forEach((u) => {
          let x = { 'hora': u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/
          let horaLocal = new Date().valueOf();

          if (x.hora + 3600000 <= horaLocal) {

            this.accidenteCollection.doc(u.id).delete().then(e => {
              console.log('Document successfully deleted!');
          }).catch(function(error) {
              console.error('Error removing document: ', error);
          });
//falta mejorar con la ubicacion del usuario
          } else if(this.getDistance() >= this.betwen2Points([this.location.lat,this.location.long],[x.latitud,x.longitud])){
            lreq.push(x);

          }

        });
        this.lastlastAccidentLoaded = d.docs[d.docs.length - 1];
        if (d.docs.length < 10) {
          this.scrollAccidentEnabled = false;
        }
        resolve(lreq);

      });
    });
  }

  /* Carga de accidentes en el mapa (Crea los marcadores) unicamente se mostraran hasta 1000 avisos*/
  getMarkAccident(): Promise<iAccidente[]>{

    return new Promise((resolve, reject) => {
      let lreq: iAccidente[] = [];
      let query;
 
      query = this.accidenteCollection.ref.orderBy('hora', 'asc').limit(1000).get();
      query.then((d) => {
        d.forEach((u) => {
          let x = { 'hora': u.id, ...u.data() };
          /*Unicamente ase van a añadir a la vista las alertas que lleven menos de una hora, por defecto estas no se mostraran y si
          el aviso sigue estando en el lugar de los hechos basta con volvera a crear la alerta*/

          let horaLocal = new Date().valueOf();

          if (x.hora + 3600000 <= horaLocal) {

            this.accidenteCollection.doc(u.id).delete().then(e => {
              console.log('Document successfully deleted!');
          }).catch(function(error) {
              console.error('Error removing document: ', error);
          });
          } else {

            lreq.push(x);

          }
        });
        resolve(lreq);

      });
    });

  }

/**
 *  Recibe un objeto y lo guarda como un documento nuevo en la colección 'meteorologia'
  Devuelve un Promise
  @param datos documento a insertar en firebase
  @return Devuelve un promise
 */
  anadirM(datos) {
    return this.meteorologiaCollection.add(datos).then(e =>{

      console.log('Todo ok');
    }).catch(err =>{

      console.log(err);
    });
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
    var distance = this.getDistance();
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

            //falta mejorar con la ubicacion del usuario
          } else if(this.getDistance() >= this.betwen2Points([this.location.lat,this.location.long],[x.latitud,x.longitud])){

            lreq.push(x);
          }
        });
        this.lastlastMeteorologyLoaded = d.docs[d.docs.length - 1];
          if (d.docs.length < 10) {
            this.scrollMeteorologyEnabled = false;
          }
        resolve(lreq);

      });
    });
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

          if (x.hora + 3600000 <= horaLocal) {
              this.meteorologiaCollection.doc(u.id).delete().then(e => {
              console.log("Document successfully deleted!");
              }).catch(function(error) {
              console.error("Error removing document: ", error);
              });
          } else {

              lreq.push(x);

          }
        });
        resolve(lreq);

      });
    });

  }
  //////////////////////////////////////////////////////////FUNCIONES VARIAS/////////////////////////////////////////////
  /**
 * Calcula la distancia entre 2 puntos
 * @param origin Array Number con las coordenadas donde esta ubicado el usuario
 * @param destination Array Number con las coordenadas de la alerta
 * @returns distancia en Km entre los dos puntos
 */
betwen2Points(origin, destination) {
  // return distance in meters
  var lon1 = this.toRadian(origin[1]),
      lat1 = this.toRadian(origin[0]),
      lon2 = this.toRadian(destination[1]),
      lat2 = this.toRadian(destination[0]);

  var deltaLat = lat2 - lat1;
  var deltaLon = lon2 - lon1;

  var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  var betwen2Points: Number;
  betwen2Points = c * EARTH_RADIUS;
  return betwen2Points;
}
/**
* Calcula los radianes de cada coordenada recibida en grados
* @param degree grados a convertir
*/
toRadian(degree) {
  return degree*Math.PI/180;
}

getDistance(){
  this.nativeStorage.getItem('distance').then(distance => {

    this.distance= distance.km ;

  }).catch(e => {
    this.distance = 1000 ;
  });
  return this.distance;
}

/**
   * Habilita el scroll para la pestaña meteorologia
   * @returns devuelve si se ha habilitado el scroll
   *  */
  misInfinityScrollEnabled() {
    return this.scrollMeteorologyEnabled;
  }


/**
   * Habilita el scroll para la pestaña accidentes
   * @returns devuelve si se ha habilitado el scroll
   */
  isInfinityScrollEnabled() {
    return this.scrollAccidentEnabled;
  }

}
