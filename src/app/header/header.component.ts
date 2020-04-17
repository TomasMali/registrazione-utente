import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../user-registration/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  //
  userIsAuthenticated = false
  userIsAdmin: boolean =false
  private authListenerSubs: Subscription
  private userSub: Subscription

  constructor(private userService: UserService, public router: Router) { }

  onLogout(){
    this.userService.logOut()
    this.router.navigate(["/home"])
  }

  ngOnInit() {
    this.userIsAuthenticated = this.userService.getIsAuth()
    this.authListenerSubs = this.userService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
           this.userIsAuthenticated = isAuthenticated
    })

    this.userSub = this.userService.getCurrentUserUpdateListener()
    .subscribe((user_: User) => {
      this.userIsAdmin = user_.admin
    })


  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
    this.userSub.unsubscribe()
  }

}
