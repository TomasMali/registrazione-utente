import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { User } from '../user-registration/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewChecked {
  form: FormGroup
  formArrived: FormGroup
  formSearch: FormGroup
  formCheckSearch: FormGroup
  users: User[] = []
  private userSub: Subscription
  today = new Date()

  body_expand: boolean = true

  // flag: any;
  search: string = ""
  condition: string = "all"
  userId: string = ""
  flag: string;

  constructor(public userService: UserService, private cdRef: ChangeDetectorRef,
     public route: ActivatedRoute, public router: Router) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] !== undefined) {
      this.userId = this.route.snapshot.params['id']
    }


    if (this.search == "")
      this.condition = "all"

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
    this.userSub = this.userService.getUsersUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users
      })
  }


  onCheckBoxSearPending() {
    this.condition = "pending"
    if(this.userId !== ""){
      this.router.navigate(['/admin'])
    }
  }

  onCheckBoxSearchAutorizzati() {
    this.condition = "autorizzati"
    if(this.userId !== ""){
      this.router.navigate(['/admin'])
    }
  }

  onCheckBoxSearchArrivati() {
    this.condition = "arrivati"
    if(this.userId !== ""){
      this.router.navigate(['/admin'])
    }
  }

  onCheckBoxSearAll() {
    this.condition = "all"
    if(this.userId !== ""){
      this.router.navigate(['/admin'])
    }
  }


/**
 * 
 */
  onFilterUser() {

    // qrCode pars
    if (this.userId !== "") {
      this.body_expand = false
      return this.users.filter(u => {
        return u._id === this.userId
      })
    }

// Se ho iniziato a scrivere
    if (this.search !== "") {
      // ricerca solo in pending
      if(this.condition === "pending"){
        return this.users.filter(u => {
          return   u.autorizzato === false && (u.nome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.nome.toLowerCase().startsWith(this.search.trim().toLowerCase())
            || u.cognome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.cognome.toLowerCase().startsWith(this.search.trim().toLowerCase()))
        })
      }
      // ricerca solo in autorizzati
      else if( this.condition === "autorizzati"){
        return this.users.filter(u => {
          return   u.autorizzato === true && (u.nome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.nome.toLowerCase().startsWith(this.search.trim().toLowerCase())
            || u.cognome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.cognome.toLowerCase().startsWith(this.search.trim().toLowerCase()))
        })
      } 
      // ricerca solo in arrivati
      else if(this.condition === "arrivati"){
        return this.users.filter(u => {
          return   u.arrivato === true && (u.nome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.nome.toLowerCase().startsWith(this.search.trim().toLowerCase())
            || u.cognome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.cognome.toLowerCase().startsWith(this.search.trim().toLowerCase()))
        })
      }
      // ricerca in tutti
      else {
        return this.users.filter(u => {
          return u.nome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.nome.toLowerCase().startsWith(this.search.trim().toLowerCase())
            || u.cognome.trim().toLowerCase() == this.search.trim().toLowerCase() || u.cognome.toLowerCase().startsWith(this.search.trim().toLowerCase())
        })
      }

    }


    if (this.condition === "all")
      return this.users

    if (this.condition === "pending") {
      return this.users.filter(x => {
        return !x.autorizzato;
      })
    }

    if (this.condition === "autorizzati") {
      return this.users.filter(x => {
        return x.autorizzato && !x.arrivato;
      })
    }

    if (this.condition === "arrivati") {
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

    this.router.navigate(['/admin'])

  }


  onDeleteUser(_id: string) {
    this.userService.deleteUser(_id)
  }






}
