export interface GroceryItem {
  id: string | null;
  name: string;
  category: GroceryCategory;
  quantity?: number;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
  purchased: boolean;
}

export interface GroceryList {
  id: number ;
  name: string;
  items: Partial<GroceryItem>[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface SmartSuggestion {
  item: GroceryItem;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export enum GroceryCategory {
  PRODUCE = 'produce',
  DAIRY = 'dairy',
  MEAT = 'meat',
  PANTRY = 'pantry',
  BEVERAGES = 'beverages',
  SNACKS = 'snacks',
  OTHER = 'other',
}

export interface CreateGroceryListRequest {
  includeSuggestions: boolean;
  maxSuggestions?: number;
}


export type GroceryItemPayload = Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt'>;
