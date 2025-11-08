import { Component } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  
  constructor(private firestore: Firestore) { }


  decreasePortions(): void { if (this.portions > 1) this.portions--; }
  increasePortions(): void { if (this.portions < 9) this.portions++; }


  decreaseCookers(): void { if (this.cookers > 1) this.cookers--; }
  increaseCookers(): void { if (this.cookers < 9) this.cookers++; }


  async onSubmit(): Promise<void> {
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
    await fetch(URL)
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
