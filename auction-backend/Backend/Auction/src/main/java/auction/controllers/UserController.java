package auction.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import auction.entities.RO.UserRO;
import auction.entities.User;
import auction.entities.enums.Role;
import auction.entities.utils.MessageUtils;
import auction.entities.utils.ResponseUtils;
import auction.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.retrieveSuccess("Users"), userService.getAll()
        ));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getUsersByRole(@RequestParam(required = false) Role role) {
        if (role == null) {
            return ResponseEntity.badRequest().body(ResponseUtils.buildErrorResponse(
                    HttpStatus.BAD_REQUEST, MessageUtils.invalidRequest("Role")
            ));
        }
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.retrieveSuccess("Users"), userService.getAllByFilter(role)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.retrieveSuccess("User"), userService.getUserById(id)
        ));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRO userRO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ResponseUtils.buildErrorResponse(
                    HttpStatus.BAD_REQUEST, MessageUtils.validationErrors(bindingResult)
            ));
        }
        userService.save(userRO);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.CREATED, MessageUtils.saveSuccess("User")
        ));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, 
                                        @Valid @RequestBody UserRO userRO, 
                                        BindingResult bindingResult, 
                                        HttpSession session) {
                                            
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ResponseUtils.buildErrorResponse(
                    HttpStatus.BAD_REQUEST, MessageUtils.validationErrors(bindingResult)
            ));
        }

        User loggedInUser = (User) session.getAttribute("loggedInUser");

        userService.update(id, userRO);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.updateSuccess("User")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                HttpStatus.OK, MessageUtils.deleteSuccess("User")
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRO userRO, HttpSession session) {
        return userService.login(userRO.getUsername(), userRO.getPassword(), session);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser != null) {
            return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(
                    HttpStatus.OK, MessageUtils.retrieveSuccess("Current user"), loggedInUser
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseUtils.buildErrorResponse(
                    HttpStatus.UNAUTHORIZED, "No user is currently logged in"
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ResponseUtils.buildSuccessResponse(HttpStatus.OK, "Logged out successfully"));
    }
}