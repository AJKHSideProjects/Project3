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
          var firstTrack = data.json().tracks.items[0]

          if (firstTrack) {
            detail.spotifyUri = firstTrack.uri
            detail = this.getSpotifyDetails(detail)
            this.postMessage(channel, message, detail)
          } else {
            this.postMessage(channel, message, detail)
          }
        });
    } else if (message.startsWith('spotify:')) {
      detail.spotifyUri = message;
      detail = this.getSpotifyDetails(detail)
      this.postMessage(channel, message, detail);

    } else if (message.startsWith('https://open.spotify.com/')){
      var parsedItem = message.split("/"); 
      var itemType = parsedItem[3]
      var itemId = parsedItem[4];
      detail.spotifyUri = "spotify:" + itemType + ":" + itemId;
      detail = this.getSpotifyDetails(detail)
      this.postMessage(channel, message, detail);

    } else {
      this.postMessage(channel, message, detail);
    }
  }

  editMessageDetail(channelId, messageId, detail) {
    var updateCollection = {}
    updateCollection['/channels/' + channelId + '/' + messageId] = {detail: detail}

    return firebase.database().ref().update(updateCollection)
  }

  getSpotifyDetails(detail) {
    if (detail.spotifyUri.startsWith("spotify:track:")){
      let trackId = this.getIdFromSpotifyUri(detail.spotifyUri)
      let trackfirstTrack = this.spotifyProvider.getTrack(trackId)
      detail = this.spotifyProvider.parseTrackResponse(trackfirstTrack, detail)
      return detail

    } else if (detail.spotifyUri.startsWith("spotify:album:")){
      let albumId = this.getIdFromSpotifyUri(detail.spotifyUri)
      let albumfirstTrack = this.spotifyProvider.getAlbum(albumId)
      detail = this.spotifyProvider.parseAlbumResponse(albumfirstTrack, detail)
      return detail
      
    } else if (detail.spotifyUri.startsWith("spotify:artist:")){
      let artistId = this.getIdFromSpotifyUri(detail.spotifyUri)
      let artistfirstTrack = this.spotifyProvider.getArtist(artistId)
      detail = this.spotifyProvider.parseArtistResponse(artistfirstTrack, detail)
      return detail
      
    }
  }

  getIdFromSpotifyUri(spotifyUri:string){
    let stringArray = spotifyUri.split(":")
    return stringArray[2]
  }
}
