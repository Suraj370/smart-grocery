import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth-service';
import { GroceryService } from '../../shared/services/grocery/grocery-service';
import { GroceryList } from '../../shared/types/grocery.type';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-grocery',
  imports: [CommonModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './grocery.html',
  styleUrl: './grocery.scss',
})
export class Grocery {
  auth = inject(AuthService);
  grocery = inject(GroceryService);
  private router = inject(Router);

  skeletonItems = new Array(3);
  error = signal<string | null>(null);
  loading = signal(true);
  groceryService: any;

  constructor() {
    this.fetchLists();
  }

  fetchLists(): void {
    this.grocery.getMyLists().subscribe({
      next: (lists) => {
        const groceryLists = lists as GroceryList[];
        this.grocery.setMyLists(groceryLists);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching grocery lists:', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  loadListDetail(listId: number) {
    this.router.navigate(['/grocery', listId]);
  }
}
