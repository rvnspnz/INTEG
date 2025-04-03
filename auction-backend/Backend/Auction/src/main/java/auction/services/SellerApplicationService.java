package auction.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auction.entities.RO.SellerApplicationRO;
import auction.entities.SellerApplication;
import auction.entities.User;
import auction.entities.enums.Role;
import auction.exceptions.ServiceException;
import auction.repositories.SellerApplicationRepository;
import auction.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;


@Service
public class SellerApplicationService {

    @Autowired
    private SellerApplicationRepository sellerApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<SellerApplication> getAllApplications() {
        return sellerApplicationRepository.findAll();
    }

    public Optional<SellerApplication> getApplicationById(Long id) {
        return sellerApplicationRepository.findById(id);
    }
    
    /**
     * Check if a user already has a seller application
     * @param userId The user ID to check
     * @return true if the user has an application, false otherwise
     */
    public boolean hasApplicationByUserId(Long userId) {
        // Find user first
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return false;
        }
        
        User user = userOptional.get();
        
        // Find applications by user
        List<SellerApplication> applications = sellerApplicationRepository.findByUser(user);
        return !applications.isEmpty();
    }

    @Transactional
    public SellerApplication createApplication(SellerApplicationRO applicationRO, HttpSession session) {
        try {
            User loggedInUser = (User) session.getAttribute("loggedInUser");
            if (loggedInUser == null) {
                throw new RuntimeException("User is not logged in");
            }

            // Check if user already has an application
            if (hasApplicationByUserId(loggedInUser.getId())) {
                throw new RuntimeException("User already has a pending or approved application");
            }

            SellerApplication application = applicationRO.toEntity();

            application.setUser(loggedInUser);

            if (applicationRO.getAdmin() != null && applicationRO.getAdmin().getUserId() != null) {
                User admin = userRepository.findById(applicationRO.getAdmin().getUserId())
                        .orElseThrow(() -> new RuntimeException("Admin not found"));
                application.setAdmin(admin);
            }

            return sellerApplicationRepository.save(application);
        } catch (Exception e) {
            throw new ServiceException("Error creating seller application", e);
        }
    }

    @Transactional
    public SellerApplication updateApplication(Long id, SellerApplicationRO applicationRO, Long adminId, HttpSession session) {
        try {
            User loggedInAdmin = (User) session.getAttribute("loggedInUser");
            if (loggedInAdmin == null || !loggedInAdmin.getRole().equals(Role.ADMIN)) {
                throw new RuntimeException("Only admins can approve applications");
            }

            Optional<SellerApplication> existingApplication = sellerApplicationRepository.findById(id);
            if (existingApplication.isPresent()) {
                SellerApplication application = existingApplication.get();

                User adminUser = userRepository.findById(adminId)
                        .orElseThrow(() -> new RuntimeException("Admin not found"));

                if (!adminUser.getRole().equals(Role.ADMIN)) {
                    throw new RuntimeException("Only admins can approve applications.");
                }

                application.setStatus(applicationRO.getStatus());
                application.setAppliedAt(applicationRO.getAppliedAt());
                application.setApprovedAt(applicationRO.getApprovedAt());

                application.setAdmin(adminUser);

                return sellerApplicationRepository.save(application);
            }
            throw new RuntimeException("Application not found");
        } catch (Exception e) {
            throw new ServiceException("Error updating seller application", e);
        }
    }

    public String deleteApplication(Long id) {
        if (!sellerApplicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found.");
        }

        sellerApplicationRepository.deleteById(id);
        return "Seller application with ID " + id + " has been successfully deleted.";
    }

}