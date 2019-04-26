import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterLoginPage } from './Register-Login.page';
import { CustomModalModule } from '../custom-modal/custom-modal.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterLoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CustomModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterLoginPage]
})
export class RegisterLoginModule {}
