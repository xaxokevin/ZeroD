import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CloudserviceService } from '../servicios/cloudservice.service';
import { CustomLoading } from '../custom-modal/custom-loading';
import { NetworkService } from '../servicios/network.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomToast } from '../custom-modal/custom-toast';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  public login: FormGroup; 

  constructor( 
    private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    public loading: CustomLoading,
    private netwoekS: NetworkService,
    private translate: TranslateService,
    public toast: CustomToast,
  
    ) { 

      this.login = this.formBuilder.group({
        email: ['', Validators.required],
        pass: ['',Validators.required],
      });
    
  }

  ngOnInit() {
  }


  registerForm(){
    if(this.netwoekS.previousStatus == 1){
      this.toast.show(this.translate.instant("noNetwork"));
    }else if(this.netwoekS.previousStatus == 0){

      let data = {
        email: this.login.get("email").value,
        pass: this.login.get("pass").value,
  
      };

      this.CloudS.loginUser(data.email,data.pass);
  }

}


}
