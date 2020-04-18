import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { User } from '../user-registration/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewChecked {
  form: FormGroup
  formArrived: FormGroup
  formCheckSearch: FormGroup
  users: User[] = []
  private userSub: Subscription
  today = new Date()

  flag: any;

  //
  pending: boolean = false;
  autorizzati: boolean = false
  arrivati: boolean = false


  condition: string= "all"

  constructor(public userService: UserService, private cdRef:ChangeDetectorRef) { 
    
  }

  ngAfterViewChecked()
  {
    
    this.cdRef.detectChanges();
  }

  ngOnInit() {

    console.log("Ciao   " + this.flag)

    this.form = new FormGroup({
      'authCheckbox': new FormControl(null, {
        validators: [Validators.required]
      })

    })

    this.formArrived = new FormGroup({
      'arrivedCheckbox': new FormControl(null, {
        validators: [Validators.required]
      })
    })




    // Charges all the user
    this.userService.getUsers()
    // In every user added from userService it updates the User[] array 
    this.userSub = this.userService.getUsersUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users
      })
  }


  onCheckBoxSearPending(){
console.log("Pending")
this.condition = "pending"
  }
  onCheckBoxSearchAutorizzati(){
    console.log("Autorizzati")
    this.condition = "autorizzati"
      }
      onCheckBoxSearchArrivati(){
        console.log("Arrivati")
        this.condition = "arrivati"
          }
            




onFilterUser(){




if(this.condition === "all")
return this.users




if(this.condition === "pending"){
  return this.users.filter(x => {
    return !x.autorizzato ;
  })
}

if(this.condition === "autorizzati"){
  return this.users.filter(x => {
    return x.autorizzato && !x.arrivato;
  })
}

if(this.condition === "arrivati"){
  return this.users.filter(x => {
    return x.autorizzato && x.arrivato;
  })
}




}





  // Only subscribe from the userService
  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onUserAuthorization(user: User) {


    user.autorizzato = this.form.value.authCheckbox
    this.userService.userUpdateAuth(user)
    

    // this.form.value.authCheckbox = true
  }


  onUserArrived(user: User) {


    user.arrivato = this.formArrived.value.arrivedCheckbox
    user.autorizzato = null

    this.userService.userUpdateAuth(user)

    // this.form.value.authCheckbox = true
  }


  onDeleteUser(_id: string) {
    console.log("#####Email: " + _id)
    this.userService.deleteUser(_id)
  }






}
