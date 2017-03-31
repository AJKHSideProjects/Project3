import { Injectable } from '@angular/core';
import firebase from 'firebase';


/*
  Generated class for the MessageData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MessageData {
  public messages;

  constructor() {
    console.log('Hello MessageData Provider');
  }

  postMessage(channel, message) {
    return firebase.database().ref('/channels/' + channel).push({
      message: message,
      detail: 'something'
    });
  }
}
