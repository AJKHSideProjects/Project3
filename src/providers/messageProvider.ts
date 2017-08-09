import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { SpotifyProvider } from './spotifyProvider';
import { AuthProvider } from './authProvider';


/*
  Generated class for the MessageData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MessageProvider {
  public messages;

  constructor(public spotifyProvider: SpotifyProvider, public authProvider: AuthProvider) {
    console.log('Hello MessageData Provider');
  }

  postMessage(channel, message, detail) {
    return firebase.database().ref('/channels/' + channel).push({
      message: message,
      detail: detail
    });
  }

  parseMessage(channel, message: string) {
    let detail = {
      spotifyUri: null,
      created: new Date().getTime(),
      user: {
        email: this.authProvider.getCurrentUser().email
      }
    };

    if (message.startsWith("/search")) {
      var searchQuery = message.replace("/search", "").trim();

      this.spotifyProvider.search(searchQuery)
        .subscribe(data => {
          var response = data.tracks.items[0];
          console.log(response);

          if (response && response.uri) {
            detail.spotifyUri = response.uri;
            this.postMessage(channel, message, detail);
          } else {
            this.postMessage(channel, message, detail);
          }
        });
    } else if (message.startsWith('spotify:')) {
      detail.spotifyUri = message;
      this.postMessage(channel, message, detail);
    } else if (message.startsWith('https://open.spotify.com/')){
      if (message.startsWith('https://open.spotify.com/track/')){
        var trackId = message.split("/")[4];
        detail.spotifyUri = "spotify:track:" + trackId;
        this.postMessage(channel, message, detail);
      } else if (message.startsWith('https://open.spotify.com/album/')){
        var trackId = message.split("/")[4];
        detail.spotifyUri = "spotify:album:" + trackId;
        this.postMessage(channel, message, detail);
      } else if (message.startsWith('https://open.spotify.com/artist/')){
        var trackId = message.split("/")[4];
        detail.spotifyUri = "spotify:artist:" + trackId;
        this.postMessage(channel, message, detail);
      }
    } else {
      this.postMessage(channel, message, detail);
    }
  }
}
