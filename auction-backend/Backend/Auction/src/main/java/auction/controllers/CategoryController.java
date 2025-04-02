package auction.controllers;

import auction.entities.Category;
import auction.entities.User;
import auction.entities.enums.Role;
import auction.entities.response.SuccessResponse;
import auction.entities.utils.MessageUtils;
import auction.entities.utils.ResponseUtils;
import auction.services.CategoryService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.retrieveSuccess("Categories"), categoryService.getAllCategories()
        ));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCategoryByName(@PathVariable String name) {
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.retrieveSuccess("Category"), categoryService.getByName(name)
        ));
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category, BindingResult bindingResult, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !loggedInUser.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.FORBIDDEN, "Only admins can create categories"
            ));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ResponseUtils.buildErrorResponse(
                    HttpStatus.BAD_REQUEST, MessageUtils.validationErrors(bindingResult)
            ));
        }

        categoryService.save(category);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.CREATED, MessageUtils.saveSuccess("Category")
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody Category category, BindingResult bindingResult, HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null || !loggedInUser.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.FORBIDDEN, "Only admins can update categories"
            ));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ResponseUtils.buildErrorResponse(
                    HttpStatus.BAD_REQUEST, MessageUtils.validationErrors(bindingResult)
            ));
        }

        categoryService.update(id, category);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.updateSuccess("Category")
        ));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.deleteSuccess("Category")
        ));
    }
}
