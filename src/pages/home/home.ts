import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { FcmProvider } from '../../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public adMob: AdMobFree, 
    public platform: Platform,
    public fcm: FcmProvider,
    public toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    if (this.platform.is('cordova')) {
      const ad: AdMobFreeInterstitialConfig = {
        id: 'ca-app-pub-6881663307118312/4719939210',
        isTesting: false,
        autoShow: false
      }
      this.adMob.interstitial.config(ad);

      // 1 in 4 chance to see an ad
      if (new Date().getTime() % 4 === 0) {
        this.adMob.interstitial.prepare()
      }

    }
    // Get a FCM token
    this.fcm.getToken()

    this.fcm.listenToNotifications().pipe(
      tap(msg => {
        const toast = this.toastCtrl.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
      })
    )
    .subscribe()

  }

}
