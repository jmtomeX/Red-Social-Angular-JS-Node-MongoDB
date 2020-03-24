import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  //pathMatch: 'full' toda la url tiene que coincidir
  {path:'login', component: LoginComponent,pathMatch: 'full'},
  {path:'registro', component: RegisterComponent,pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:
  [
    RouterModule
  ],
  providers:[

  ],
  bootstrap: [
    AppComponent
  ]


})
export class AppRoutingModule { }
