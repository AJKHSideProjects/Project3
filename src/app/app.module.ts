import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ChannelModal } from '../pages/channel-modal/channel-modal';
// import { MessageDetailPage } from '../pages/message-detail/message-detail';
import { ChatPage } from '../pages/chat/chat';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/authProvider';
import { MessageProvider } from '../providers/messageProvider';
import { ChannelProvider } from '../providers/channelProvider';
import { SpotifyProvider } from '../providers/spotifyProvider';

import { AngularFireModule } from 'angularfire2';

var config = {
  apiKey: "AIzaSyBNWsgweTD3jS0Vsr4rX-JrjbyxEPYHBiY",
  authDomain: "sharemusic-93eaf.firebaseapp.com",
  databaseURL: "https://sharemusic-93eaf.firebaseio.com",
  storageBucket: "sharemusic-93eaf.appspot.com",
  messagingSenderId: "608734698171"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ChatPage,
    SignupPage,
    ResetPasswordPage,
    ProfilePage,
    ChannelModal
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ChatPage,
    ChannelModal
  ],
  providers: [
    StatusBar,
    AuthProvider,
    MessageProvider,
    ChannelProvider,
    SpotifyProvider,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
