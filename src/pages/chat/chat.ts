import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MessageProvider } from '../../providers/messageProvider';
import { AuthProvider } from '../../providers/authProvider';
import { ChannelProvider } from '../../providers/channelProvider';
import { SpotifyProvider } from '../../providers/spotifyProvider';
import { DomSanitizer } from '@angular/platform-browser';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InviteUserModal } from '../invite-user-modal/invite-user-modal';
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
  @ViewChild(Content) content: Content;
  items: FirebaseListObservable<any[]>;
  channel;
  messageValue: string = '';
  messageForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, messageData: MessageProvider,
  public channelProvider: ChannelProvider, public spotifyProvider: SpotifyProvider, public authProvider: AuthProvider,
  public messageProvider: MessageProvider, public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
  public modalController: ModalController) {
    this.channel = navParams.data.channel || {$key: 1};
    this.items = af.database.list('/channels/' + this.channel.$key);
    this.items.subscribe(x => {this.content && this.content.scrollToBottom(0)});
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  encodeURI(uri) {
    let url = `https://embed.spotify.com/?uri=${encodeURIComponent(uri)}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addMessage() {
    if (this.messageForm.value.message) {
      this.messageProvider.parseMessage(this.channel.$key, this.messageForm.value.message);
      this.messageForm.reset();
    }
  }

  unsubscribe() {
    this.channelProvider.unsubscribeUserFromChannel(this.channel.$key);
  }

  inviteUserToChannel(){
    let self = this;
    let inviteUserModalPage = this.modalController.create(InviteUserModal, { userId: 8675309 });

    inviteUserModalPage.onDidDismiss(email => {
      self.channelProvider.inviteUserToChannel(email);
    });

    inviteUserModalPage.present();
  }
}
