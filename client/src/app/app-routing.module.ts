import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  //pathMatch: 'full' toda la url tiene que coincidir
  {path:'login', component: LoginComponent,pathMatch: 'full'},
  {path:'registro', component: RegisterComponent,pathMatch: 'full'},
  {path:'home', component: HomeComponent,pathMatch: 'full'},
  {path:'actualizar-usuario', component: UserEditComponent,pathMatch: 'full'},
  {path:'gente/:page', component: UsersComponent},
  {path:'gente', component: UsersComponent},
  {path:'timeline', component: TimelineComponent},
  {path:'**', component: HomeComponent}


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
