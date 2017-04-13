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
    this.channel = navParams.data.channel || {$key: 1};
    this.messageData = messageData;
    this.items = af.database.list('/channels/' + this.channel.$key);
    this.items.subscribe(x => {this.content.scrollToBottom(0)})
  }

// use ngmodel... look that shit up
  addMessage(message: string) {
    this.messageData.postMessage(this.channel.$key, message).then((message) => {
      this.messageValue = null;
    });

    this.parseMessage(message);
  }

  unsubscribe() {
    this.channelProvider.unsubscribeUserFromChannel(this.channel.$key);
  }

  parseMessage(message: string){
    if (message.startsWith("/search")){
      var searchQuery = message.replace("/search","").trim();

      this.spotifyProvider.search(searchQuery)
        .subscribe(data => {
          var response = data.tracks.items[0];
          console.log(response);

          if(response){
            console.log(response.uri);
            this.addMessage(response.uri);
          }
        });
    } else if (message.startsWith('spotify:track:')){
      var trackId = message.replace('spotify:track:','').trim();

      this.spotifyProvider.getTrack(trackId)
        .subscribe(data => {
          console.log(data);
          var artist = data.artists[0].name;
          var album = data.album.name;
          var trackName = data.name;

          this.addMessage(artist + ' - ' + album + ' - ' + trackName);
        })
    } else if (message.startsWith('spotify:album:')){
      var albumId = message.replace('spotify:album:','').trim();

      this.spotifyProvider.getAlbum(albumId)
        .subscribe(data => {
          console.log(data);
          var artist = data.artists[0].name;
          var album = data.name;

          this.addMessage(artist + ' - ' + album);
        })
    } else if (message.startsWith('spotify:artist:')){
      var albumId = message.replace('spotify:artist:','').trim();

      this.spotifyProvider.getArtist(albumId)
        .subscribe(data => {
          console.log(data);
          var artist = data.name;
          var genre = data.genres[0];

          this.addMessage(artist + ' - ' + genre);
        })
    }
  }
}
