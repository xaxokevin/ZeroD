
import { CustomModalModule } from './../custom-modal/custom-modal.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { setTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';





import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

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
    CustomModalModule,
    TabsPageRoutingModule,
   
  ],
  declarations: [TabsPage,]
})
export class TabsPageModule {}
