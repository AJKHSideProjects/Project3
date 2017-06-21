import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase'
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Push, PushToken } from '@ionic/cloud-angular';

import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';
import { ChannelModal } from '../pages/channel-modal/channel-modal';

import { ChannelProvider } from '../providers/channelProvider'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  zone: NgZone;
  channelList: FirebaseListObservable<any[]>;
  firebase: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public angularFire: AngularFire, public channelProvider: ChannelProvider, public modalController: ModalController,
    public push: Push) {
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

      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      })

      this.push.rx.notification()
        .subscribe((msg) => {
          alert(msg.title + ': ' + msg.text)
        })
    });
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