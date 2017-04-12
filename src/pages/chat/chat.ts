import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MessageData } from '../../providers/messageProvider';
import { ChannelProvider } from '../../providers/channelProvider';
import { SpotifyProvider } from '../../providers/spotifyProvider';

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage {
  items: FirebaseListObservable<any[]>;
  messageData;
  channel;
  messageValue: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, messageData: MessageData,
  public channelProvider: ChannelProvider, public spotifyProvider: SpotifyProvider) {
    this.channel = navParams.data.channel || {$key: 1};
    this.messageData = messageData;
    this.items = af.database.list('/channels/' + this.channel.$key);
  }
// use ngmodel... look that shit up
  addMessage(message) {
    this.messageData.postMessage(this.channel.$key, message).then((message) => {
      this.messageValue = null;
    });
  }

  unsubscribe() {
    this.channelProvider.unsubscribeUserFromChannel(this.channel.$key);
  }

  searchSpotify(){
    this.spotifyProvider.searchSpotify("On Letting Go");
  }
}
