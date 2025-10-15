import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroceryItem, GroceryList } from '../../types/grocery.type';
import { environment } from '../../../../environments/environment.development';
interface Suggestion {
  name: string;
  category: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  quantity?: number;
  unit?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AiSuggestion {

  constructor(private http: HttpClient) {}

  getSuggestions(items: GroceryItem[]): Observable<{ suggestions: Suggestion[] }> {
    return this.http.post<{ suggestions: Suggestion[] }>(`${environment.expressUrl}/suggestions`, { items });
  }
}
