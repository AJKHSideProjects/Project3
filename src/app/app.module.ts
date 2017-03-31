import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { MessageDetailPage } from '../pages/message-detail/message-detail';
import { ChatPage } from '../pages/chat/chat';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthData } from '../providers/authProvider';
import { MessageData } from '../providers/messageProvider';
import { ChannelProvider } from '../providers/channelProvider';

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
    ProfilePage
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
    ChatPage
  ],
  providers: [
    StatusBar,
    AuthData,
    MessageData,
    ChannelProvider,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
