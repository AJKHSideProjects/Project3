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

  unsubscribeUserFromChannel(channelId) {
    firebase.database().ref('/userProfile/' + this.fireAuth.currentUser.uid + '/subscriptions/channels/' + channelId).remove();
  }

  inviteUserToChannel(email, channelId) {
    var updates = {};
    

    firebase.database().ref('channelList/' + channelId).once('value').then(function(channelSnapshot){
      firebase.database().ref('userProfile').orderByChild('email').equalTo(email).once('value').then(function(userSnapshot){
        var userId;
        userSnapshot.forEach(function(user){
          userId = user.key;
          return true;
        });
        var channelName = channelSnapshot.child('name').val();
        updates['/userProfile/' + userId + '/subscriptions/channels/' + channelId] = channelName;
        firebase.database().ref().update(updates);
    });
    });
  }


}
