import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  form: NgForm
  emailOrPassword: boolean = true
  private authListenerSubs: Subscription
  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {

    this.authListenerSubs = this.userService.getAuthStatusListener()
      .subscribe(isAuthenticated => {

        this.emailOrPassword = isAuthenticated

        if (!this.emailOrPassword) {
          this.router.navigate(["/login"])
          this.form.reset()
        }
        else {
          this.router.navigate(["/admin"])
        }


      })
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

  onLogin(form: NgForm) {
    this.form = form
    this.userService.login(form.value.email, form.value.password)
  }

}
