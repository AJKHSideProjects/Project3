import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(uri) {
    let url = `https://embed.spotify.com/?uri=${encodeURIComponent(uri)}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
