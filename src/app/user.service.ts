import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user-registration/user.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { AuthData } from './login/login-data';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  map(arg0: (auth: any) => boolean) {
    throw new Error("Method not implemented.");
  }

  urlUser = "http://192.168.1.119:3000/user/"

  private users: User[] = []
  private usersUpdated = new Subject<User[]>()
  //
  private currentUser: User
  private userUpdated = new Subject<User>()

  //
  private token: string
  private authStatusListener = new Subject<boolean>()
  private isAuthenticated = false
  private tokenTimer: any

  constructor(private http: HttpClient) { }

  getIsAuth() {
    return this.isAuthenticated
  }

  getToken() {
    return this.token
  }


  getCurrentUserUpdateListener() {
    return this.userUpdated.asObservable()
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable()
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }



  autoAuthUser() {
    const authInformation = this.getAuthData()
    if (!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }


  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut()
    }, duration * 1000)
  }



  addUser(user: User) {

    this.http.post<any>(this.urlUser + "signup", user)
      .subscribe(resultData => {
        console.log("Broswer ******* " + resultData.result._id)

        const user_ = {
          _id: resultData.result._id,
          nome: resultData.result.nome,
          cognome: resultData.result.cognome,
          cf: resultData.result.cf,
          eta: resultData.result.eta,
          telefono: resultData.result.telefono,
          email: resultData.result.email,
          password: resultData.result.password,
          qrCode: resultData.result.qrCode,
          admin: resultData.result.admin,
          autorizzato: resultData.result.autorizzato,
          arrivato: resultData.arrivato
        }

        this.users.push(user_)
        this.usersUpdated.next([...this.users])

        var cloneUser: User = { ...user_ }
        cloneUser.qrCode = null
        cloneUser.password = null
        this.userUpdated.next(cloneUser)


      }, err => {
        if (err.status === 500) {

          this.userUpdated.next(null)
        }

      })
  }






  getOneUser(email: string) {
    this.http.get<{ message: string, user: User }>(this.urlUser + "findme/" + email)

      .subscribe(resultData => {
        console.log("Broswer ******* " + JSON.stringify(resultData.user))

        this.currentUser = resultData.user
        var cloneUser: User = { ...this.currentUser }
        this.userUpdated.next(cloneUser)

      }, err => {

      })
  }






  getUsers() {
    this.http.get<{ message: string, posts: any }>(this.urlUser)
      .pipe(map((userData) => {
        return userData.posts.map(user => {
          console.log("Telebingo:    " + user.nome)
          return {
            _id: user._id,
            nome: user.nome,
            cognome: user.cognome,
            cf: user.cf,
            eta: user.eta,
            telefono: user.telefono,
            email: user.email,
            password: null,
            qrCode: user.qrCode,
            admin: user.admin,
            autorizzato: user.autorizzato,
            arrivato: user.arrivato
          }
        })
      }))
      .subscribe(resultData => {

        console.log("Broswer ******* " + resultData)

        this.users = resultData
        this.usersUpdated.next([...this.users])

      })
  }




  /**
   * Cancella un utente data la mail
   * @param email 
   */
  deleteUser(userId: string) {
    this.http.delete(this.urlUser + userId)
      .subscribe(() => {

        const updatedUsers = this.users.filter(user => user._id !== userId)
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users])
      }, err => {
        alert("Utente " + userId + " non cancellato")
      })
  }

  userUpdateAuth(user: User) {
    this.http.put(this.urlUser + "puti", user)
      .subscribe(response => {
        const updateUsers = [...this.users]
        const oldUsersIndex = updateUsers.findIndex(u => u._id === user._id)
        updateUsers[oldUsersIndex] = user
        this.users = updateUsers
        this.usersUpdated.next([...this.users])
        //
        this.currentUser = user
        var cloneUser: User = { ...this.currentUser }
        this.userUpdated.next(cloneUser)
        //
        this.getUsers()
      })

  }





  /**
   * User login first time
   * @param email 
   * @param password 
   */
  login(email: string, password: string) {
    const authData: AuthData = {
      email: email, password: password
    }
    this.http.post<{ token: string, expiresIn: number }>(this.urlUser + "login", authData)
      .subscribe(response => {
        if (response.token) {
          const expireInDuration = response.expiresIn
          this.setAuthTimer(expireInDuration)
          //
          localStorage.setItem("email", email)
          this.isAuthenticated = true
          this.token = response.token
          this.saveAuthData(response.token, new Date(new Date().getTime() + expireInDuration * 1000))
          this.authStatusListener.next(true)
        }

      }, err => {
        if (err.status === 401) {
          //    alert("Email o Password sbagliata!")
          this.authStatusListener.next(false)
        }
      })

  }



  /**
   * User logout method
   */
  logOut() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
  }


  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('email')
  }

  /**
   * Returns the user token and expiration
   */
  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }




}
