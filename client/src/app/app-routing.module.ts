import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { UserGuard } from './services/user.guard';
import { PruebaComponent } from './components/prueba/prueba.component';

//pathMatch: 'full' toda la url tiene que coincidir
// hay que crear tres rutas no acepta la ?
const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent,pathMatch: 'full'},
  {path:'registro', component: RegisterComponent,pathMatch: 'full'},
  {path:'home', component: HomeComponent,pathMatch: 'full'},
  {path:'actualizar-usuario', component: UserEditComponent,pathMatch: 'full', canActivate:[UserGuard]},
  {path:'gente',component: UsersComponent, canActivate:[UserGuard]},
  {path:'gente/:page' ,component: UsersComponent, canActivate:[UserGuard]},
  {path:'timeline', component: TimelineComponent, canActivate:[UserGuard]},
  {path:'perfil/:id', component: ProfileComponent, canActivate:[UserGuard]},
  {path:'siguiendo/:id/:page' ,component: FollowingComponent, canActivate:[UserGuard]},
  {path:'seguidores/:id/:page',component: FollowedComponent, canActivate:[UserGuard]},
  {path:'prueba',component: PruebaComponent, canActivate:[UserGuard]},
  {path:'**', component: HomeComponent},

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
    UserGuard
  ],
  bootstrap: [
    AppComponent
  ]


})
export class AppRoutingModule { }
