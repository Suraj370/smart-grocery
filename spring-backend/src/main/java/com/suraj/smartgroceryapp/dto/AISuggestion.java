package com.suraj.smartgroceryapp.dto;


import com.suraj.smartgroceryapp.entity.GroceryCategory;
import com.suraj.smartgroceryapp.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AISuggestion {
    private String name;
    private GroceryCategory category;
    private String reason;
    private Priority priority;
    private Integer quantity;
    private String unit;
}
