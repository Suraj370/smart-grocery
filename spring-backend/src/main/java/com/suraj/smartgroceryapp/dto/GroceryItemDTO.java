package com.suraj.smartgroceryapp.dto;

import com.suraj.smartgroceryapp.entity.GroceryCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroceryItemDTO {
    private Long id;
    private String name;
    private GroceryCategory category;
    private Integer quantity;
    private String unit;
    private Boolean purchased;


}
