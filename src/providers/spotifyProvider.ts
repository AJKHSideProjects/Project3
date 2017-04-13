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

  constructor(public http: Http) {
    console.log('Hello SpotifyProvider Provider');
  }

  search(queryString: string){
    return this.http.get('https://api.spotify.com/v1/search?q=' + queryString + '&type=track&limit=1')
      .map(res => res.json());
  }

  getTrack(trackId: string){
    return this.http.get('https://api.spotify.com/v1/tracks/' + trackId)
      .map(res => res.json());
  }

  getAlbum(albumId: string){
    return this.http.get('https://api.spotify.com/v1/albums/' + albumId)
      .map(res => res.json());
  }

  getArtist(artistId: string){
    return this.http.get('https://api.spotify.com/v1/artists/' + artistId)
      .map(res => res.json());
  }
}
