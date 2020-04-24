import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from './login/auth.guard';
import { AuthGuardA } from './login/auth.guardA';



const routes: Routes = [
    { path: "*", component: HomeComponent,   pathMatch: "full"   },
    { path: 'home', component: HomeComponent },
    { path: 'myaccount', component: MyaccountComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'registrati', component: UserRegistrationComponent },
    { path: 'admin', component: UserListComponent, canActivate: [AuthGuardA] },
    { path: 'admin/:id', component: UserListComponent, canActivate: [AuthGuardA] }
  ];
  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, AuthGuardA]

  })
  export class AppRoutingModule { }
  