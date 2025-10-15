import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GroceryList } from '../../types/grocery.type';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GroceryService {
  private _groceryLists = signal<GroceryList[] | null>(null);
  groceryList = this._groceryLists.asReadonly();
  constructor(private http: HttpClient) {}

  getMyLists(): Observable<GroceryList[]> {
    return this.http.get<GroceryList[]>(`${environment.apiBaseUrl}/api/grocery/my-lists`);
  }

  setMyLists(lists: GroceryList[]): void {
    this._groceryLists.set(lists);
  }

  getListById(id: string): Observable<GroceryList> {
    return this.http.get<GroceryList>(`${environment.apiBaseUrl}/api/grocery/${id}`);
  }

  createGroceryList(data: Partial<GroceryList>): Observable<GroceryList> {
    return this.http.post<GroceryList>(`${environment.apiBaseUrl}/api/grocery/`, data);
  }

  updateList(listId: string, payload: GroceryList): Observable<GroceryList> {
    return this.http.put<GroceryList>(`${environment.apiBaseUrl}/api/grocery/${listId}`, payload);
  }

  deleteItemFromList(listId: string, itemId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/api/grocery/${listId}/items/${itemId}`
    );
  }
}
