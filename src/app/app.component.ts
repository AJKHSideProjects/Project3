import { Component, ViewChild, NgZone } from '@angular/core';
import {Nav, Platform, ModalController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase'
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';
import { ChannelModal } from '../pages/channel-modal/channel-modal';

import { ChannelProvider } from '../providers/channelProvider'
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  zone: NgZone;
  channelList: FirebaseListObservable<any[]>;
  firebase: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push,
    public angularFire: AngularFire, public channelProvider: ChannelProvider, public modalController: ModalController, public alertCtrl: AlertController) {
    this.firebase = firebase;
    this.zone = new NgZone({});

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
          this.rootPage = LoginPage;
          unsubscribe();
        } else {
          this.rootPage = ChatPage;
          this.channelList = angularFire.database.list('/userProfile/' + user.uid + '/subscriptions/channels')
          this.channelList.forEach(element => {
            console.log(element)
          });
          this.initializeApp();
          unsubscribe();
        }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();
    });
  }

  pushSetup() {
    const options: PushOptions = {
      android: {
        senderID: '608734698171'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: notification.message
        });
        youralert.present();
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      //do whatever you want with the registration ID
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }



  openChannel(channel) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(ChatPage, { channel: channel });
  }

  addChannel() {
    let channelModal = this.modalController.create(ChannelModal, { userId: 8675309 });

    channelModal.onDidDismiss(name => {
      this.channelProvider.createChannel(name);
    });

    channelModal.present();
  }
}
