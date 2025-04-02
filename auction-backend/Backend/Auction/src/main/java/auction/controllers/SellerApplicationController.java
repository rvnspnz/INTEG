package auction.controllers;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import auction.entities.User;
import auction.entities.enums.ApplicationStatus;
import auction.exceptions.ServiceException;
import auction.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import auction.entities.RO.SellerApplicationRO;
import auction.entities.RO.UserRO;
import auction.entities.SellerApplication;
import auction.services.SellerApplicationService;
import auction.services.UserService;


@RestController
@RequestMapping("/seller-applications")
public class SellerApplicationController {

    @Autowired
    private SellerApplicationService sellerApplicationService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<SellerApplication> getAllApplications() {
        return sellerApplicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public SellerApplication getApplicationById(@PathVariable Long id) {
        return sellerApplicationService.getApplicationById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @PostMapping
    public ResponseEntity<SellerApplication> createApplication(
            @RequestBody SellerApplicationRO applicationRO, HttpSession session) {

        try {
            // Pass session to the service layer to check if the user is logged in
            SellerApplication createdApplication = sellerApplicationService.createApplication(applicationRO, session);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // New endpoint to handle frontend format with user_id and description
    @PostMapping("/simple")
    public ResponseEntity<?> createSimpleApplication(
            @RequestBody Map<String, Object> payload, HttpSession session) {

        try {
            Long userId = Long.valueOf(payload.get("user_id").toString());
            String description = (String) payload.get("description");
            
            // Find the user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Store user in session for verification
            session.setAttribute("loggedInUser", user);
            
            // Create application data
            SellerApplicationRO applicationRO = new SellerApplicationRO();
            UserRO userRO = new UserRO();
            userRO.setUserId(userId);
            
            applicationRO.setUser(userRO);
            applicationRO.setDescription(description);
            applicationRO.setStatus(ApplicationStatus.PENDING);
            applicationRO.setAppliedAt(LocalDateTime.now());
            
            // Create the application
            SellerApplication createdApplication = sellerApplicationService.createApplication(applicationRO, session);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to create application: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SellerApplication> updateApplication(
            @PathVariable Long id,
            @RequestBody SellerApplicationRO applicationRO,
            @RequestParam Long adminId,
            HttpSession session) {

        try {
            // Pass adminId and session (to check if the user is an admin) to the service layer
            SellerApplication updatedApplication = sellerApplicationService.updateApplication(id, applicationRO, adminId, session);
            return ResponseEntity.ok(updatedApplication);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Long id) {
        String message = sellerApplicationService.deleteApplication(id);
        return ResponseEntity.ok(message);
    }

}