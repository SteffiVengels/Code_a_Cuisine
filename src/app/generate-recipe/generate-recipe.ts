import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { query, orderBy } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { RouterLink, RouterLinkActive } from "@angular/router";

type Ingredient = {
  id?: string;
  ingredientName: string;
  servingSize: number;
  servingSizeUnit: 'gram' | 'piece' | 'ml';
};

@Component({
  selector: 'app-generate-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './generate-recipe.html',
  styleUrl: './generate-recipe.scss',
})
export class GenerateRecipe {
  ingredientName = '';
  servingSize: number | null = null;
  servingSizeUnit: 'gram' | 'piece' | 'ml' = 'gram';

  ingredients$: Observable<Ingredient[]>;

  constructor(private firestore: Firestore) {
    const colRef = collection(this.firestore, 'ingredients');
    const q = query(colRef, orderBy('servingSize', 'asc'));
    this.ingredients$ = collectionData(q, { idField: 'id' }) as Observable<Ingredient[]>;
  }

  async onSubmit() {
    const name = this.ingredientName.charAt(0).toUpperCase() + this.ingredientName.slice(1).toLowerCase();
    await addDoc(collection(this.firestore, 'ingredients'), {
      ingredientName: name,
      servingSize: this.servingSize,
      servingSizeUnit: this.servingSizeUnit || 'gram',
    });
    this.ingredientName = '';
    this.servingSize = null;
    this.servingSizeUnit = 'gram';
  }

  onEdit(item: Ingredient) {
    console.log('Edit item', item);
  }

  async onDelete(item: Ingredient) {
    const { deleteDoc, doc } = await import('firebase/firestore');
    await deleteDoc(doc(this.firestore, 'ingredients', item.id!));
  }
}
