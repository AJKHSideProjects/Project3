import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SpotifyProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SpotifyProvider {

  spotifyUrlBase = window.location.origin + ':5000/spotify/';

  constructor(public http: Http) {
    console.log('Hello SpotifyProvider Provider');
  }

  search(queryString: string){
    return this.http.get(this.spotifyUrlBase + 'getSearch?q=' + queryString + '&type=track&limit=1');
  }

  getTrack(trackId: string){
    return this.http.get(//this.spotifyUrlBase + 'getTrack/'
      'http://localhost:5000/spotify/getTrack/'+ trackId);
  }

  getAlbum(albumId: string){
    return this.http.get(//this.spotifyUrlBase + 'getAlbum/'
    'http://localhost:5000/spotify/getAlbum/'+ albumId);
  }

  getArtist(artistId: string){
    return this.http.get(//this.spotifyUrlBase + 'getArtist/'
    'http://localhost:5000/spotify/getArtist/' + artistId);
  }

  parseTrackResponse(response, detail){
    response.subscribe(data => {
      detail.track = data.json().name
      detail.album = data.json().album.name
      detail.artist = data.json().album.artists[0].name
      detail.image = data.json().images[1].url
      detail.popularity = data.json().popularity
      detail.type = data.json().type

      return detail
    })
  }

  parseAlbumResponse(response, detail){
    response.subscribe(data => {
      detail.album = data.json().name
      detail.artist = data.json().artists[0].name
      detail.image = data.json().images[1].url
      detail.popularity = data.json().popularity
      detail.type = data.json().type

      return detail
    })
  }

  parseArtistResponse(response, detail){
    response.subscribe(data => {
      detail.artist = data.json().name
      detail.image = data.json().images[1].url
      detail.popularity = data.json().popularity
      detail.type = data.json().type

      return detail
    })
  }


}
