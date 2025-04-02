package auction.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import auction.entities.SellerApplication;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {
    List<SellerApplication> findByStatus(String status);
}