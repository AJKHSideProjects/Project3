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
}
