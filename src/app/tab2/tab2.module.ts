
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { setTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  imports: [TranslateModule.forChild({
    loader: {
      provide: TranslateLoader, 
      useFactory: (setTranslateLoader), deps: [HttpClient]
    }
  }),
    IonicModule,
    CommonModule,
  
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page, ],
entryComponents: []
})
export class Tab2PageModule {
  
}
