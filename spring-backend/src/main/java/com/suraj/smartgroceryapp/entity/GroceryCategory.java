package com.suraj.smartgroceryapp.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Defines the fixed categories for organizing grocery items.
 */
public enum GroceryCategory {
    PRODUCE,
    DAIRY,
    MEAT,
    PANTRY,
    BEVERAGES,
    SNACKS,
    OTHER;


    @JsonCreator
    public static GroceryCategory fromString(String key) {
        return key == null ? null : GroceryCategory.valueOf(key.toUpperCase());
    }
}
