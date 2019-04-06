import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CloudserviceService } from '../servicios/cloudservice.service';
import { CustomLoading } from '../custom-modal/custom-loading';
import { NetworkService } from '../servicios/network.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomToast } from '../custom-modal/custom-toast';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.page.html',
  styleUrls: ['./register-login.page.scss'],
})
export class RegisterLoginPage implements OnInit {
  
  public login: FormGroup; 
  private user;

  constructor( 
    private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    public loading: CustomLoading,
    private netwoekS: NetworkService,
    private translate: TranslateService,
    public toast: CustomToast,
    private nativeStorage: NativeStorage,
  
    ) { 

     

      this.login = this.formBuilder.group({
        email: ['', Validators.required],
        pass: ['',Validators.required],
      });
    
  }

  ngOnInit() {
   
  }
  ionViewCanEnter(){

  }

  


  registerForm(){
    if(this.netwoekS.previousStatus == 1){
      this.toast.show(this.translate.instant("noNetwork"));
    }else if(this.netwoekS.previousStatus == 0){

      let data = {
        email: this.login.get("email").value,
        pass: this.login.get("pass").value,
  
      };

      this.CloudS.createUser(data.email,data.pass);
     
      
  }

}


}
