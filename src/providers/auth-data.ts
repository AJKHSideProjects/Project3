import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
  public fireAuth: any;
  public userProfile: any;

  constructor() {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/userProfile');
  }

  loginUser(email, password): firebase.Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): firebase.Promise<any> {
    return this.fireAuth.signOut();
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({ email: email });
      });
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
}
