import { Injectable } from '@angular/core';
import { HttpClient,} from '@angular/common/http';



@Injectable()
export class WeatherService {

  private apiKey = 'aff3fbe093709cef1027c04909536c9e';
  constructor(public http: HttpClient){}
 

  //Obtiene los datos meteorologicos de aemet
  //falta implementacion
  getRemoteData(){
    
    let url ='http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid='+this.apiKey;
    this.http.get(url).subscribe((d)=>{
      if(d["weather"]){

        console.log(d);

        
      }else{
        console.log("sin datos");
      }
    })
    console.log(url);
    return this.http.get(url)
  }
}