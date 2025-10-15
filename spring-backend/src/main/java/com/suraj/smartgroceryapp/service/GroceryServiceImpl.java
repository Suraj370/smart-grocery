package com.suraj.smartgroceryapp.service;

import com.suraj.smartgroceryapp.dto.GroceryItemDTO;
import com.suraj.smartgroceryapp.dto.GroceryListRequest;
import com.suraj.smartgroceryapp.entity.GroceryItem;
import com.suraj.smartgroceryapp.entity.GroceryList;
import com.suraj.smartgroceryapp.repository.GroceryItemRepository;
import com.suraj.smartgroceryapp.repository.GroceryListRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GroceryServiceImpl implements GroceryService{
    private GroceryListRepository groceryListRepository;
    private GroceryItemRepository groceryItemRepository;
    @Autowired
    public  GroceryServiceImpl(GroceryListRepository groceryListRepository, GroceryItemRepository groceryItemRepository){
        this.groceryListRepository = groceryListRepository;
        this.groceryItemRepository = groceryItemRepository;
    }

    @Override
    public Optional<GroceryList> getListById(Long listId) {
        return groceryListRepository.findById(listId);
    }

    @Override
    public List<GroceryList> getListsByOwner(String ownerUid) {
        return groceryListRepository.findAllByOwnerUid(ownerUid);
    }

    @Override
    public GroceryList getListByOwner(String ownerUid, Long listId) {
        return groceryListRepository
                .findByIdAndOwnerUid(listId, ownerUid)
                .orElseThrow(() -> new RuntimeException("List not found"));
    }

    /**
     * Adds an item to a list. If the list does not exist, a new one is created
     * automatically with a name based on the current date.
     *
     * @param ownerUid The unique ID of the user.
     * @param listRequest The new GroceryItems to add.
     * @return The updated or newly created GroceryList.
     */


    @Override
    @Transactional
    public GroceryList createList(String ownerUid, GroceryListRequest listRequest) {


        GroceryList existingList;
        existingList = new GroceryList();
        existingList.setOwnerUid(ownerUid);


        existingList.setName(listRequest.getName());
        existingList.setCompleted(listRequest.getCompleted() != null ? listRequest.getCompleted() : false);
        existingList.setItems(new ArrayList<>());


        // 5. Map DTO items to entities, set relationship, and add to the list
        if (listRequest.getItems() != null) {
            for (GroceryItemDTO itemDTO : listRequest.getItems()) {
                if(itemDTO.getQuantity() <= 0){
                    continue;
                }
                GroceryItem newItem = new GroceryItem();
                newItem.setName(itemDTO.getName());
                newItem.setCategory(itemDTO.getCategory());
                newItem.setUnit(itemDTO.getUnit());
                newItem.setQuantity(itemDTO.getQuantity());
                newItem.setPurchased(itemDTO.getPurchased());

                // Set bidirectional relationship
                newItem.setList(existingList);
                existingList.getItems().add(newItem);
            }
        }

        if (existingList.getItems().isEmpty()) {
            // Throw an exception to prevent the transaction from completing
            // and to inform the user why the list was not created.
            throw new IllegalArgumentException("Cannot create a grocery list without any valid items (quantity > 0).");
        }

        return groceryListRepository.save(existingList);
    }

    @Override
    public GroceryList updateList(String ownerUid, Long listId, GroceryListRequest listRequest) {
       GroceryList existingList = groceryListRepository
               .findByIdAndOwnerUid(listId, ownerUid)
               .orElseThrow(() -> new RuntimeException("List not found"));

        if (listRequest.getName() != null) {
            existingList.setName(listRequest.getName());
        }
        if (listRequest.getCompleted()) {
            existingList.setCompleted(true);
        }

        // Handle item updates + additions
        if (listRequest.getItems() != null) {
            for (GroceryItemDTO itemDTO : listRequest.getItems()) {
                if (itemDTO.getId() != null) {
                    // Update existing item
                    GroceryItem existingItem = existingList.getItems().stream()
                            .filter(i -> i.getId().equals(itemDTO.getId()))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Item not found: " + itemDTO.getId()));

                    existingItem.setName(itemDTO.getName());
                    existingItem.setCategory(itemDTO.getCategory());
                    existingItem.setUnit(itemDTO.getUnit());
                    existingItem.setQuantity(itemDTO.getQuantity());
                    existingItem.setPurchased(itemDTO.getPurchased());
                } else {
                    // Add new item
                    GroceryItem newItem = new GroceryItem();
                    newItem.setName(itemDTO.getName());
                    newItem.setCategory(itemDTO.getCategory());
                    newItem.setUnit(itemDTO.getUnit());
                    newItem.setQuantity(itemDTO.getQuantity());
                    newItem.setList(existingList);
                    newItem.setPurchased(itemDTO.getPurchased());
                    existingList.getItems().add(newItem);
                }
            }
        }

        return groceryListRepository.save(existingList);
    }





    /**
     * Deletes a specific item from a grocery list, provided the authenticated
     * user is the owner of the list.
     *
     * @param listId The ID of the {@link com.suraj.smartgroceryapp.entity.GroceryList} from which
     * the item will be deleted.
     * @param itemId The ID of the {@link com.suraj.smartgroceryapp.entity.GroceryItem} to be
     * removed.
     * @param ownerUid The unique identifier of the user who owns the list,
     * typically retrieved from the authenticated {@link java.security.Principal}.
     * @see com.suraj.smartgroceryapp.entity.GroceryList
     * @see com.suraj.smartgroceryapp.entity.GroceryItem
     */
    @Override
    @Transactional
    public void deleteItemFromList(Long listId, Long itemId, String ownerUid) {
        // 1. Find the list and the item.
        GroceryList groceryList = getListById(listId)
                .orElseThrow(() -> new RuntimeException("Grocery list not found with ID: " + listId));

        // 2. Verify that the user is the owner of the list.
        if (!groceryList.getOwnerUid().equals(ownerUid)) {
            throw new RuntimeException("User does not have permission to modify this list.");
        }

        // 3. Find the item to be deleted from the list's items.
        GroceryItem itemToDelete = groceryList.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in the specified list."));

        // 4. Remove the item from the list's collection.
        // Because of `orphanRemoval = true` in GroceryList,
        // JPA will automatically delete the item from the database when the list is saved.
        groceryList.getItems().remove(itemToDelete);
    }
}
