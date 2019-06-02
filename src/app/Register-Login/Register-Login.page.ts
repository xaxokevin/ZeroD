import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CloudserviceService } from '../servicios/cloudservice.service';
import { CustomLoading } from '../custom-modal/custom-loading';
import { NetworkService } from '../servicios/network.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomToast } from '../custom-modal/custom-toast';
import { CustomModalModule } from '../custom-modal/custom-modal.module';
import { RegisterComponent } from '../customComponent/register/register.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.page.html',
  styleUrls: ['./register-login.page.scss'],
})
export class RegisterLoginPage implements OnInit {
  ngOnInit() {
  }
  
  public login: FormGroup; 
  regexp:any

  constructor( 
    private formBuilder: FormBuilder,
    private CloudS: CloudserviceService,
    public loading: CustomLoading,
    private netwoekS: NetworkService,
    private translate: TranslateService,
    public toast: CustomToast,
    public cmm: CustomModalModule,
    public router: Router
    ) {
      this.regexp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$');

      this.login = this.formBuilder.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],
        pass: ['', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])],
      });
  }

/**
 * Metodo que se ejecuta cuando se hace el submit del formulario de login
 */
  LoginForm(){

    if (this.netwoekS.previousStatus === 1) {
      this.toast.show(this.translate.instant('noNetwork'));
    } else if (this.netwoekS.previousStatus === 0) {

      const data = {
        email: this.login.get('email').value,
        pass: this.login.get('pass').value,
      };

      this.loading.show('');
      this.CloudS.loginUser(data.email, data.pass);
      this.loading.hide();
  }

}

/**
 * Metodo que abre el modal del registro de usuarios
 */
openRegister() {

  this.cmm.showRegister(RegisterComponent, this);
}


}
