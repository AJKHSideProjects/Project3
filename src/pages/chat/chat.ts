import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
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
  @ViewChild(Content) content: Content
  items: FirebaseListObservable<any[]>;
  messageData;
  channel;
  messageValue: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, messageData: MessageData,
    public channelProvider: ChannelProvider, public spotifyProvider: SpotifyProvider) {
    this.channel = navParams.data.channel || { $key: 1 };
    this.messageData = messageData;
    this.items = af.database.list('/channels/' + this.channel.$key);
    this.items.subscribe(x => { this.content && this.content.scrollToBottom(0) })
  }

  // use ngmodel... look that shit up
  addMessage(message: string) {
    if (message) {
      this.messageData.postMessage(this.channel.$key, message).then((message) => {
        this.messageValue = null;
      });

      this.messageData.parseMessage(this.channel.$key, message);
    }
  }

  unsubscribe() {
    this.channelProvider.unsubscribeUserFromChannel(this.channel.$key);
  }
}
