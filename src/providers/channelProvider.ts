import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ChannelProvider {
  public fireAuth: any;
  public channelList: any;

  constructor() {
    this.fireAuth = firebase.auth();
    this.channelList = firebase.database().ref('/channelList');
  }

  createChannel(name) {
    var key = this.channelList.push().key;

    var channelData = {
      users: {},
      settings: {},
      name: name
    }

    var updates = {};
    updates['/channelList/' + key] = channelData;
    updates['/userProfile/' + this.fireAuth.currentUser.uid + '/subscriptions/channels/' + key] = name;

    return firebase.database().ref().update(updates);
  }
}
