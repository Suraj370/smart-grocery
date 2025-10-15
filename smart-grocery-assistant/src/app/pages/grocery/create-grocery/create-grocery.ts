import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroceryService } from '../../../shared/services/grocery/grocery-service';
import { suggestUnitForItem } from '../../../shared/constants/units';
import {
  GroceryCategory,
  GroceryItem,
  GroceryItemPayload,
} from '../../../shared/types/grocery.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-grocery',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    
  ],
  templateUrl: './create-grocery.html',
  styleUrl: './create-grocery.scss',
})
export class CreateGrocery {
  grocery = inject(GroceryService);
  private router = inject(Router);

  listName = signal('');
  localItems = signal<GroceryItem[]>([]);

  // enable save only when valid
  isSaveEnabled = computed(() => {
    return  this.localItems().length > 0;
  });
  saving = signal(false);

  error = signal<string | null>(null);
  newItem = {
    name: '',
    quantity: 1,
    unit: 'pieces',
    category_id: '',
  };

  listname = '';


  addGroceryItem() {
    if (this.newItem.name.trim() && this.newItem.quantity > 0) {
      const suggestedUnit = suggestUnitForItem(this.newItem.name);
      const categorizeItem = this.categorizeItem(this.newItem.name);
      const item: GroceryItem = {
        ...this.newItem,
        id: crypto.randomUUID(),
        unit: suggestedUnit,
        category: categorizeItem,
        createdAt: new Date(),
        updatedAt: new Date(),
        purchased: false,
      };

      this.localItems.update((items) => [...items, item]);
      this.newItem = { name: '', quantity: 1, unit: 'pieces', category_id: '' };
    }
  }

  removeItem(id: string) {
    if (id == '') return;
    this.localItems.update((items) => items.filter((i) => i.id !== id));
  }

  saveList() {

    if (!this.isSaveEnabled()) {
      return;
    }
    
    const payload = {
      name: this.listName() || 'Grocery List ' + new Date().toISOString().split('T')[0],
      items: this.localItems().map(
        (item): GroceryItemPayload => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          purchased: item.purchased,
        })
      ),
    };

    console.log('Saving grocery list:', payload);
    this.saving.set(true);

    this.grocery.createGroceryList(payload).subscribe({
      next: (res) => {
        console.log('✅ List saved successfully', res);
        this.localItems.set([]);
        this.listName.set('');
        this.saving.set(false);
        this.router.navigate(['/grocery']);
      },
      error: (err) => {
        console.error('❌ Failed to save list', err);
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  private categorizeItem(itemName: string): GroceryCategory {
    const name = itemName.toLowerCase();

    if (['apple', 'banana', 'carrot', 'lettuce', 'tomato'].some((p) => name.includes(p))) {
      return GroceryCategory.PRODUCE;
    }
    if (['milk', 'cheese', 'yogurt', 'butter'].some((d) => name.includes(d))) {
      return GroceryCategory.DAIRY;
    }
    if (['chicken', 'beef', 'pork'].some((m) => name.includes(m))) {
      return GroceryCategory.MEAT;
    }
    if (['pasta', 'rice', 'bread', 'flour'].some((p) => name.includes(p))) {
      return GroceryCategory.PANTRY;
    }
    if (['soda', 'juice', 'water', 'beer'].some((b) => name.includes(b))) {
      return GroceryCategory.BEVERAGES;
    }
    if (['chips', 'cookies', 'crackers'].some((s) => name.includes(s))) {
      return GroceryCategory.SNACKS;
    }

    return GroceryCategory.OTHER;
  }
}
