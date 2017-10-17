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
    let lastUriIndex;
    this.items = <FirebaseListObservable<any>> af.database.list('/channels/' + this.channel.$key).map(items => {
      return items.map((item, i) => {
        item.renderSpotifyPlayer = item.detail ? item.detail.spotifyUri : false;
        if (item.renderSpotifyPlayer && lastUriIndex != null) {
          items[lastUriIndex].renderSpotifyPlayer = false;
        }
        if (item.renderSpotifyPlayer) lastUriIndex = i;
        if (item.detail && item.detail.user && item.detail.user.email && items[i-1] && items[i-1].detail && items[i-1].detail.user && items[i-1].detail.user.email && (items[i-1].detail.user.email == item.detail.user.email)) {
          item.sameUser = true;
        }

        /*
        ==================================
        Temp Code - used to backfill details
        ==================================
        let uri = item.detail ? item.detail.spotifyUri : null
        if (uri) {
          if (uri.startsWith("spotify:track:")){
            let trackId = uri.substring(14)
            let trackResponse = spotifyProvider.getTrack(trackId)
            trackResponse.subscribe(data => {
              item.detail.track = data.json().name
              item.detail.album = data.json().album.name
              item.detail.artist = data.json().artists[0].name
              item.detail.image = data.json().album.images[1].url
              item.detail.popularity = data.json().popularity
              item.detail.type = data.json().type

              messageProvider.editMessageDetail(this.channel.$key, item.$key, item.detail)
            })
          } else if (uri.startsWith("spotify:album:")){
            let albumId = uri.substring(14)
            let albumResponse = spotifyProvider.getAlbum(albumId)
            albumResponse.subscribe(data => {
              item.detail.album = data.json().name
              item.detail.artist = data.json().artists[0].name
              item.detail.image = data.json().images[1].url
              item.detail.popularity = data.json().popularity
              item.detail.type = data.json().type

              messageProvider.editMessageDetail(this.channel.$key, item.$key, item.detail)
            })
          } else if (uri.startsWith("spotify:artist:")){
            let artistId = uri.substring(15)
            let artistResponse = spotifyProvider.getArtist(artistId)
            artistResponse.subscribe(data => {
              item.detail.artist = data.json().name
              item.detail.image = data.json().images[1].url
              item.detail.popularity = data.json().popularity
              item.detail.type = data.json().type

              messageProvider.editMessageDetail(this.channel.$key, item.$key, item.detail)
            })
          }
        }
        ================================
        */

        return item;
      })
    });
    this.items.subscribe(x => {
      this.content && this.content.scrollToBottom(0)
    });
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
      self.channelProvider.inviteUserToChannel(email, self.channel.$key);
    });

    inviteUserModalPage.present();
  }
}
