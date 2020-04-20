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


//pathMatch: 'full' toda la url tiene que coincidir
// hay que crear tres rutas no acepta la ?
const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent,pathMatch: 'full'},
  {path:'registro', component: RegisterComponent,pathMatch: 'full'},
  {path:'home', component: HomeComponent,pathMatch: 'full'},
  {path:'actualizar-usuario', component: UserEditComponent,pathMatch: 'full'},
  {path:'gente/:page', component: UsersComponent},
  {path:'gente', component: UsersComponent},
  {path:'timeline', component: TimelineComponent},
  {path:'perfil/:id', component: ProfileComponent},
  {path:'siguiendo/:id?/:page?', component: FollowingComponent},
  {path:'seguidores/:id?/:page?', component: FollowedComponent},
  {
    path: 'mensajes', loadChildren: () =>
    import('./messages/messages.module').then(m => m.MessagesModule)
  },
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

  ],
  bootstrap: [
    AppComponent
  ]


})
export class AppRoutingModule { }
