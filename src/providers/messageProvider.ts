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

    this.postMessage(channel, message, detail);

    if (message.startsWith("/search")) {
      var searchQuery = message.replace("/search", "").trim();

      this.spotifyProvider.search(searchQuery)
        .subscribe(data => {
          var response = data.tracks.items[0];
          console.log(response);

          if (response) {
            console.log(response.uri);
            this.postMessage(channel, response.uri, {});
          }
        });
    } else if (message.startsWith('spotify:')) {
      detail.spotifyUri = message;
      this.postMessage(channel, null, detail);
    }
  }
}
