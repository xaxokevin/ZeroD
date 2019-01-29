import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class WeatherService {

  private apiKey = 'aff3fbe093709cef1027c04909536c9e';
  constructor(public http: HttpClient){}

  //Obtiene los datos meteorologicos de aemet
  //falta implementacion
  getRemoteData(){
    
    let url ='api.openweathermap.org/data/2.5/weather?lat=37.408730&lon=-4.485600&appid='+this.apiKey;
    this.http.get(url).subscribe((d)=>{
      if(d["weather"]){
        this.http.get(d["datos"]).subscribe((x)=>{
          console.log("he entrado aqui"+x)
        });
      }else{
        console.log("sin datos");
      }
    })
    console.log(url);
    //return this.http.get(url)
  }
}