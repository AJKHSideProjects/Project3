import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {FirebaseListObservable} from "angularfire2";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "chat-list-component",
  templateUrl: "chatList.html"
})
export class ChatListComponent {
  @Input() items: FirebaseListObservable<any[]>;

  renderSpotifyWidget(item) {
    item.renderSpotifyPlayer = true;
  }
}
