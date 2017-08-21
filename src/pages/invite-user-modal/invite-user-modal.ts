import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-invite-user-modal',
  templateUrl: 'invite-user-modal.html'
})
export class InviteUserModal {
  userEmailValue: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InviteUserModalPage');
  }

  inviteUser(email) {
    this.viewCtrl.dismiss(email);
  }
}
