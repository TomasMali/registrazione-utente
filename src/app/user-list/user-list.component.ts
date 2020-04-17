import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user-registration/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  form: FormGroup
  users: User[] = []
  private userSub: Subscription
  today = new Date()

  constructor(public userService: UserService) { }

  

  ngOnInit() {



    this.form = new FormGroup({

      'authCheckbox': new FormControl(null, {
        validators: [Validators.required]
      }),
      
    })



    // Charges all the user
    this.userService.getUsers()
    // In every user added from userService it updates the User[] array 
    this.userSub = this.userService.getUsersUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users
      })
  }



  // Only subscribe from the userService
  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onUserAuthorization(user: User){
 
   user.autorizzato = this.form.value.authCheckbox
 
    this.userService.userUpdateAuth(user)

    this.form.value.authCheckbox = true
  }


  onDeleteUser(_id: string){
    console.log("#####Email: " + _id)
    this.userService.deleteUser(_id)
  }



}
