import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register-login', loadChildren: './Register-Login/Register-Login.module#RegisterLoginModule' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
 
  
  
  

  
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

