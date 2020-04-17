

import { CanActivate, Router, } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user-registration/user.model';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, public router: Router) {

    }

    canActivate(route: import("@angular/router")
        .ActivatedRouteSnapshot, state: import("@angular/router")
            .RouterStateSnapshot): boolean | import("@angular/router")
            .UrlTree | import("rxjs").Observable<boolean | import("@angular/router")
            .UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

        const isAuth = this.userService.getIsAuth()
        if (!isAuth) {
            this.router.navigate(["/login"])
        }

        return isAuth;

    }

}