import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyaccountComponent } from './myaccount/myaccount.component';



const routes: Routes = [
    { path: "*", component: HomeComponent,   pathMatch: "full"   },
    { path: 'home', component: HomeComponent },
    { path: 'myaccount', component: MyaccountComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registrati', component: UserRegistrationComponent }
  ];
  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],

  })
  export class AppRoutingModule { }
  