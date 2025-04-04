package auction.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import auction.entities.SellerApplication;
import auction.entities.User;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {
    List<SellerApplication> findByStatus(String status);
    List<SellerApplication> findByUser(User user);
}