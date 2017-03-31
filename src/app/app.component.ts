import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase'
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { ChatPage } from '../pages/chat/chat';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  zone: NgZone;
  channelList: FirebaseListObservable<any[]>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, angularFire: AngularFire) {
    // var config = {
    //   apiKey: "AIzaSyBNWsgweTD3jS0Vsr4rX-JrjbyxEPYHBiY",
    //   authDomain: "sharemusic-93eaf.firebaseapp.com",
    //   databaseURL: "https://sharemusic-93eaf.firebaseio.com",
    //   storageBucket: "sharemusic-93eaf.appspot.com",
    //   messagingSenderId: "608734698171"
    // };
    // firebase.initializeApp(config);

    this.zone = new NgZone({});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
          this.rootPage = LoginPage;
          unsubscribe();
        } else {
          this.rootPage = ChatPage;
          unsubscribe();
        }
      });
    });

    this.channelList = angularFire.database.list('/channelList')
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  

  openChannel(channel) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(ChatPage, {channel: channel});
  }
}
