import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChannelProvider {
  public fireAuth: any;
  public channelList: any;

  constructor() {
    this.fireAuth = firebase.auth();
    this.channelList = firebase.database().ref('/channelList');
  }

  createChannel(name) {
    return this.channelList.push({
      users: {},
      settings: {},
      name: name
    });
  }
}
