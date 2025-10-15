package com.suraj.smartgroceryapp.controller;

import com.suraj.smartgroceryapp.dto.GroceryListRequest;
import com.suraj.smartgroceryapp.entity.GroceryList;
import com.suraj.smartgroceryapp.service.GroceryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/api/grocery")
public class GroceryController {

    private GroceryService groceryService;

    public GroceryController(GroceryService groceryService){
        this.groceryService = groceryService;
    }

    @PostMapping("/")
    public ResponseEntity<GroceryList> saveList(@RequestBody GroceryListRequest listRequest,
                                                Principal principal){
        String ownerUid = principal.getName();

        // Use the new saveList method
        GroceryList updatedList = groceryService.createList(ownerUid, listRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/grocery/{id}")
                .buildAndExpand(updatedList.getId())
                .toUri();

        // Returns 201 Created status
        return ResponseEntity.created(location).body(updatedList);
    }
    @GetMapping("/my-lists")
    public ResponseEntity<List<GroceryList>> getMyLists(Principal principal) {
        // The principal.getName() method returns the 'username' from the JWT token.
        String ownerUid = principal.getName();

        List<GroceryList> lists = groceryService.getListsByOwner(ownerUid);

        if (lists.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(lists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroceryList> getListById(
            @PathVariable Long id,
             Principal user) {
        GroceryList list = groceryService.getListByOwner(user.getName(), id);
        return ResponseEntity.ok(list);
    }



    @PutMapping("/{id}")
    public ResponseEntity<GroceryList> updateList(
            @PathVariable("id") Long listId,
            @RequestBody GroceryListRequest listRequest,
            Principal principal) {

        // The authenticated user’s UID
        String ownerUid = principal.getName();

        GroceryList updatedList = groceryService.updateList(ownerUid, listId, listRequest);

        // Build a self-referencing URI for HATEOAS/REST compliance
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/grocery/{id}")
                .buildAndExpand(updatedList.getId())
                .toUri();

        return ResponseEntity
                .ok()
                .location(location) // Adds 'Location' header for discoverability
                .body(updatedList);
    }




    @DeleteMapping("/{listId}/items/{itemId}")
    public ResponseEntity<Void> deleteItemFromList(@PathVariable Long listId, @PathVariable Long itemId, Principal principal) {
        String ownerUid = principal.getName();
        try {
            groceryService.deleteItemFromList(listId, itemId, ownerUid);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


}
