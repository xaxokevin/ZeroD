import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class WeatherService {

  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4aXNrbzEyQGdtYWlsLmNvbSIsImp0aSI6ImZhYWVmNDI5LTcxMTUtNDMyOS04YzFhLTJhODMxMGY5NTFiZSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTQ3NzIzOTgwLCJ1c2VySWQiOiJmYWFlZjQyOS03MTE1LTQzMjktOGMxYS0yYTgzMTBmOTUxYmUiLCJyb2xlIjoiIn0.7SmbpPvLPgssvjNGs8xkWp_5Q05767urSsAqt3gt8Dw';

  constructor(public http: HttpClient){}

  getRemoteData(){
    
    let url ='https://opendata.aemet.es/opendata/api/avisos_cap/ultimoelaborado/area/esp/?api_key='+this.apiKey;
    this.http.get(url).subscribe((d)=>{
      if(d["datos"]){
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