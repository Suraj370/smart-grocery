package com.suraj.smartgroceryapp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
@Entity
@Table(name = "grocery_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroceryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING) // Store enum as a string in the database
    @Column(nullable = false)
    private GroceryCategory category;

    private Integer quantity;

    private String unit;

    @Column(nullable = false)
    private  Boolean purchased;

    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    /**
     * Relationship Mapping: Many items belong to one list.
     * @ManyToOne defines the relationship.
     * @JoinColumn specifies the Foreign Key column name in the 'grocery_item' table.
     */
    // In GroceryItem.java

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    @JsonBackReference // Add this annotation
    private GroceryList list;

    // --- JPA LIFECYCLE CALLBACKS ---

    /**
     * Sets createdAt and updatedAt before the entity is persisted (saved for the first time).
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    /**
     * Sets updatedAt before the entity is updated (saved after the first time).
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }



}


