import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user-registration/user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit, OnDestroy {

  today = (new Date());
  user: User = null
  private userSub: Subscription

  constructor(public userService: UserService) { }

  ngOnInit() {
    
    if (this.userService.getIsAuth()) {
      this.userService.getOneUser(localStorage.getItem('email'))
    }

    this.userSub = this.userService.getCurrentUserUpdateListener()
    .subscribe((user_: User) => {
      this.user = user_
    })

  }

  ngOnDestroy() {
     this.userSub.unsubscribe()
 
   }

}
