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

  response: any;

  constructor(public http: Http) {
    console.log('Hello SpotifyProvider Provider');
  }

  searchSpotify(queryString: string){
    this.http.get('https://api.spotify.com/v1/search?q=' + queryString + '&type=track&limit=1')
      .map(res => res.json())
      .subscribe(data => this.response = data.tracks.items[0]);
    console.log(this.response);

    if(this.response){
      console.log(this.response.uri)
    }
  }

}
