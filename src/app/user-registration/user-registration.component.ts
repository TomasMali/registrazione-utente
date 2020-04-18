import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './user.model';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit, OnDestroy {



  // Variables
  form: FormGroup
  user: User = null
  private userSub: Subscription
  hideButton: boolean = false
  userExsist: boolean =false



  constructor(public userService: UserService) { }

  ngOnInit() {

    this.form = new FormGroup({

      'nome': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'cognome': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'cf': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'eta': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'telefono': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'email': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'nuovaPassword': new FormControl(null, {
        validators: [Validators.required]
      }),
      //
      'password': new FormControl(null, {
        validators: [Validators.required]
      }),
    })


    this.userSub = this.userService.getCurrentUserUpdateListener()
      .subscribe((user_: User) => {

        if (user_ !== null) {
          this.user = user_

          this.hideButton = true;

          this.form.reset()
        }
        else {
          this.user = null
          this.userExsist = true
        }
    

      })


  }


  ngOnDestroy() {
    this.userSub.unsubscribe()
  }




  /**
   * Only registers an user
   */
  onUserRegistration() {

    if (!this.form.valid) {
      console.log("TUTTO INVALID")
      return
    }

    console.log(this.form)

    const formValue = this.form.value

    const user = {
      _id: null,
      nome: formValue.nome,
      cognome: formValue.cognome,
      cf: formValue.cf,
      eta: formValue.eta,
      telefono: formValue.telefono,
      email: formValue.email,
      password: formValue.password,
      qrCode: null,
      admin: false,
      autorizzato: false,
      arrivato: false
    }

    this.userService.addUser(user)


  }

}
