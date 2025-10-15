package com.suraj.smartgroceryapp.dto;

import lombok.Data;

import java.util.List;

@Data
 public class GroceryListRequest {
    private Long id;
    private String name;
    private Boolean completed;
    private List<GroceryItemDTO> items;
}
