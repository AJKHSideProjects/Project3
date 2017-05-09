import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { SpotifyProvider } from './spotifyProvider';


/*
  Generated class for the MessageData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MessageProvider {
  public messages;

  constructor(public spotifyProvider: SpotifyProvider) {
    console.log('Hello MessageData Provider');
  }

  postMessage(channel, message, detail) {
    return firebase.database().ref('/channels/' + channel).push({
      message: message,
      detail: detail
    });
  }

  parseMessage(channel, message: string) {
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
    } else if (message.startsWith('spotify:track:')) {
      var trackId = message.replace('spotify:track:', '').trim();

      this.spotifyProvider.getTrack(trackId)
        .subscribe(data => {
          console.log(data);
          var artist = data.artists[0].name;
          var album = data.album.name;
          var trackName = data.name;

          this.postMessage(channel, `${artist} - ${album} - ${trackName}`, {});
        })
    } else if (message.startsWith('spotify:album:')) {
      var albumId = message.replace('spotify:album:', '').trim();

      this.spotifyProvider.getAlbum(albumId)
        .subscribe(data => {
          console.log(data);
          var artist = data.artists[0].name;
          var album = data.name;

          this.postMessage(channel, artist + ' - ' + album, {});
        })
    } else if (message.startsWith('spotify:artist:')) {
      var albumId = message.replace('spotify:artist:', '').trim();

      this.spotifyProvider.getArtist(albumId)
        .subscribe(data => {
          console.log(data);
          var artist = data.name;
          var genre = data.genres[0];

          this.postMessage(channel, artist + ' - ' + genre, {});
        })
    }
  }
}
