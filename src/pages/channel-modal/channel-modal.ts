import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-channel-modal',
  templateUrl: 'channel-modal.html'
})
export class ChannelModal {
  channelNameValue: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChannelModalPage');
  }

  dismiss(name) {
    this.viewCtrl.dismiss(name);
  }
}
