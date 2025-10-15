package com.suraj.smartgroceryapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AISuggestionWrapper {
    private List<AISuggestion> suggestions;
    private String summary;


}
