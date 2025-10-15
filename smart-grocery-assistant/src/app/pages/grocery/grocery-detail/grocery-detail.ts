import { Component, computed, effect, inject, signal } from '@angular/core';
import { GroceryService } from '../../../shared/services/grocery/grocery-service';
import { ActivatedRoute } from '@angular/router';
import { GroceryCategory, GroceryItem, GroceryList } from '../../../shared/types/grocery.type';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { suggestUnitForItem } from '../../../shared/constants/units';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AiSuggestion } from '../../../shared/services/grocery/ai-suggestion';

@Component({
  selector: 'app-grocery-detail',
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
    MatCheckboxModule,
  ],
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetail {
  groceryService = inject(GroceryService);
  route = inject(ActivatedRoute);
  aiSuggestion = inject(AiSuggestion);

  list = signal<GroceryList | null>(null);
  error = signal<string | null>(null);
  saving = signal(false);
  suggestions: any[] = [];

  onItemNameChange(item: Partial<GroceryItem>) {
    const suggested = suggestUnitForItem(item.name ?? '');
    const categorizeItem = this.categorizeItem(item.name ?? '');

    const l = this.list();

    if (l) {
      const updatedItems = l.items.map((i) =>
        i === item ? { ...i, unit: suggested, category: categorizeItem } : i
      );

      this.list.set({ ...l, items: updatedItems });
    }
  }

  readonly items = computed(() => {
    return this.list()?.items ?? [];
  });

  newItem: Partial<GroceryItem> = {
    name: '',
    quantity: 1,
    unit: '',
    category: GroceryCategory.OTHER,
    purchased: false,
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.groceryService.getListById(id).subscribe({
      next: (list) => this.list.set(list),
      error: () => this.error.set('Unable to fetch list'),
    });
  }

  get listName() {
    return this.list()?.name || '';
  }
  set listName(value: string) {
    const l = this.list();
    if (l) this.list.set({ ...l, name: value });
  }

  addItem() {
    const l = this.list();
    if (!l || !this.newItem.name?.trim()) return;

    if (!this.newItem.quantity || this.newItem.quantity <= 0) return;
    const suggestedUnit = suggestUnitForItem(this.newItem.name);
    const categorizeItem = this.categorizeItem(this.newItem.name);
    const item: Partial<GroceryItem> = {
      name: this.newItem.name,
      quantity: this.newItem.quantity,
      id: null,
      unit: suggestedUnit,
      category: categorizeItem,

      purchased: false,
    };
    l.items.push(item);
    this.list.set({ ...l });

    this.newItem = { name: '', quantity: 1, unit: '', category: GroceryCategory.OTHER };
  }

  removeItem(itemId: string | null) {
    const l = this.list();
    if (!l) return;

    l.items = l.items.filter((item) => String(item.id) !== String(itemId));
    this.list.set({ ...l });

    if (itemId) {
      this.groceryService.deleteItemFromList(l.id.toString(), itemId.toString()).subscribe();
    }
  }

  saveChanges() {
    const l = this.list();
    if (!l) return;

    this.saving.set(true);
    this.groceryService.updateList(l.id.toString(), l).subscribe({
      next: (updated) => {
        this.list.set(updated);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  fetchSuggestions() {
    const currentItems = this.list()?.items?.filter(
      (item): item is GroceryItem => !!item.name && !!item.id // check required fields
    );
    if (!currentItems?.length) return;

    this.aiSuggestion.getSuggestions(currentItems).subscribe((res) => {
      console.log('AI Suggestions:', res.suggestions);
      this.suggestions = res.suggestions;
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
