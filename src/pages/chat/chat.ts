import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MessageProvider } from '../../providers/messageProvider';
import { AuthProvider } from '../../providers/authProvider';
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
  channel;
  messageValue: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, messageData: MessageProvider,
  public channelProvider: ChannelProvider, public spotifyProvider: SpotifyProvider, public authProvider: AuthProvider,
  public messageProvider: MessageProvider) {
    this.channel = navParams.data.channel || {$key: 1};
    this.items = af.database.list('/channels/' + this.channel.$key);
    this.items.subscribe(x => {this.content && this.content.scrollToBottom(0)})
  }

  addMessage(message: string) {
    let detail = {
      user: {
        email: this.authProvider.getCurrentUser().email
      }
    };
    if (message) {
      this.messageProvider.postMessage(this.channel.$key, message, detail).then((message) => {
        this.messageValue = null;
      });

      this.messageProvider.parseMessage(this.channel.$key, message);
    }
  }

  unsubscribe() {
    this.channelProvider.unsubscribeUserFromChannel(this.channel.$key);
  }
}
