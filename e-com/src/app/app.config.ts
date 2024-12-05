import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(
      {
        "projectId": "angular-final-8779b",
        "appId": "1:859870271830:web:6698afb157c71527261ef7",
        "storageBucket": "angular-final-8779b.firebasestorage.app",
        "apiKey": "AIzaSyDCZHxR7aYFZETRsywU6c0ZsR6Gzt7XBGM",
        "authDomain": "angular-final-8779b.firebaseapp.com",
        "messagingSenderId": "859870271830",
        "measurementId": "G-SGECXJ5C7L"
      })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
