package com.suraj.smartgroceryapp.repository;

import com.suraj.smartgroceryapp.entity.GroceryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroceryItemRepository  extends JpaRepository<GroceryItem, Long> {
}
