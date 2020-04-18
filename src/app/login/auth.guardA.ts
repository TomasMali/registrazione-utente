

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user-registration/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthGuardA implements CanActivate, OnInit {
    user: User
    constructor(private userService: UserService, public router: Router) {
        // check if admin
        this.userService.getOneUser(localStorage.getItem('email'))
    }

    ngOnInit() {
        this.userService.getOneUser(localStorage.getItem('email'))
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const isAuth = this.userService.getIsAuth()
        if (!isAuth) {
            this.router.navigate(["/login"])
            return false
        }

        // check if admin
        this.userService.getOneUser(localStorage.getItem('email'))

        return this.userService.getCurrentUserUpdateListener().pipe(
            map(e => {
                if (e.admin) {
                    return true;
                } else {
                    this.router.navigate(["/myaccount"])
                    return false
                }
            })
        );
    }



}