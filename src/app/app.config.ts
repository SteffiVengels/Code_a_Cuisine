import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyC1Y2Qs7DvymoaPWvaGC0xzbHA3sT6fkjE",
      authDomain: "code-a-cuisine.firebaseapp.com",
      databaseURL: "https://code-a-cuisine-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "code-a-cuisine",
      storageBucket: "code-a-cuisine.firebasestorage.app",
      messagingSenderId: "495322099283",
      appId: "1:495322099283:web:411e5a3a5164c2c0e020a6"
    })),
    provideFirestore(() => getFirestore()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
