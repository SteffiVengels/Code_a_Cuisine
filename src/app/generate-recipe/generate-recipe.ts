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

  // Editierzustand
  editingId: string | null = null;
  editServingSize: number | null = null;
  editServingSizeUnit: 'gram' | 'piece' | 'ml' = 'gram';

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
    if (!item.id) return;
    this.editingId = item.id;
    this.editServingSize = item.servingSize;
    this.editServingSizeUnit = item.servingSizeUnit;
  }

  onCancelEdit() {
    this.editingId = null;
    this.editServingSize = null;
    this.editServingSizeUnit = 'gram';
  }

  async onSaveEdit(item: Ingredient) {
    if (!item.id) return;
    const size = Number(this.editServingSize);
    const unit = this.editServingSizeUnit;
    if (!isFinite(size) || size <= 0 || !unit) return;

    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(this.firestore, 'ingredients', item.id), {
      servingSize: size,
      servingSizeUnit: unit,
    });

    this.onCancelEdit();
  }

  async onDelete(item: Ingredient) {
    const { deleteDoc, doc } = await import('firebase/firestore');
    await deleteDoc(doc(this.firestore, 'ingredients', item.id!));
  }
}
