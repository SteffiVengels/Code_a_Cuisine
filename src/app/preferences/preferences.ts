import { Component } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingPage } from './loading-page/loading-page';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingPage],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  portions = 1;
  cookers = 1;
  cookingTimeMap: { [key: string]: boolean } = {
    quick: false,
    medium: false,
    complex: false
  };
  cuisinesMap: { [key: string]: boolean } = {
    german: false,
    italian: false,
    indian: false,
    japanese: false,
    gourmet: false,
    fusion: false
  };
  dietPreferencesMap: { [key: string]: boolean } = {
    vegetarian: false,
    vegan: false,
    keto: false,
    'no-preferences': false
  };
  private _isLoading = false;
  get isLoading() { return this._isLoading; }
  set isLoading(v: boolean) {
    this._isLoading = v;
    document.body.classList.toggle('app-loading', !!v);
    // Notify globally so Header/Footer reagieren können
    window.dispatchEvent(new CustomEvent('app-loading-changed', { detail: { isLoading: v } }));
  }

  constructor(private firestore: Firestore) {
    this.isLoading = this._isLoading; // initial sync to body class
  }


  decreasePortions(): void { if (this.portions > 1) this.portions--; }
  increasePortions(): void { if (this.portions < 9) this.portions++; }


  decreaseCookers(): void { if (this.cookers > 1) this.cookers--; }
  increaseCookers(): void { if (this.cookers < 9) this.cookers++; }


  async onSubmit(): Promise<void> {
    this.isLoading = true;
    const data = {
      portions: this.portions,
      cookers: this.cookers,
      cookingTime: this.getSelectedKeys(this.cookingTimeMap),
      cuisine: this.getSelectedKeys(this.cuisinesMap),
      dietPreferences: this.getSelectedKeys(this.dietPreferencesMap)
    };
    await addDoc(collection(this.firestore, 'settings'), data);
    console.log('Settings saved successfully');
    this.resetSelections();

    const URL = 'http://localhost:5678/webhook-test/23249a46-0451-403f-8102-a0efa4745204';
    try {
      const response = await fetch(URL);
      const body: any = await response.json(); // { status: "done" }
      if (body?.status === 'done') {
        // navigate and keep the loading indicator active until the new page loads
        window.location.href = '/results';
        return;
      }
      // if not done, stop loading so the user can interact/retry
      this.isLoading = false;
    } catch (err) {
      console.error('Webhook request failed', err);
      this.isLoading = false;
    }
  }


  private getSelectedKeys(map: Record<string, boolean>): string[] {
    return Object.keys(map).filter(key => map[key]);
  }


  private resetSelections(): void {
    this.portions = 1;
    this.cookers = 1;
    Object.keys(this.cookingTimeMap).forEach(k => this.cookingTimeMap[k] = false);
    Object.keys(this.cuisinesMap).forEach(k => this.cuisinesMap[k] = false);
    Object.keys(this.dietPreferencesMap).forEach(k => this.dietPreferencesMap[k] = false);
  }
}
